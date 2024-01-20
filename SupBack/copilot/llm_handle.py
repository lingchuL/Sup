import json

import openai
from openai import OpenAI
import tiktoken

from settings.copilot_setting import CopilotSetting

from log_handle import SupLogger


class LLM(object):
	def __init__(self, in_setting=CopilotSetting()):
		self.setting = in_setting
		pass


class ChatGPT(LLM):
	def __init__(self, in_setting=CopilotSetting()):
		super().__init__(in_setting)

		one_api_key = self.setting.one_api_key
		assert one_api_key is not None and one_api_key != ""

		one_api_url = self.setting.one_api_base_url
		assert one_api_url is not None and one_api_url != ""
		openai.base_url = one_api_url

		self.temperature = 0.2
		self.frequency_penalty = 0.5
		self.model = "gpt-3.5-turbo"
		self.encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
		self.encoding_gpt4 = tiktoken.encoding_for_model("gpt-4")

		self.client = OpenAI(api_key=one_api_key, base_url=one_api_url)

	def talk(self, message_list: list) -> str:
		if self.client is None:
			SupLogger.info("openai client is None")
			return ""

		token_num = len(self.encoding.encode(json.dumps(message_list)))
		# SupLogger.info(f"[ask] message_list: {message_list}，token_num: {token_num}")

		response = self.client.chat.completions.create(
			model=self.model,
			temperature=self.temperature,
			frequency_penalty=self.frequency_penalty,
			messages=message_list
		)
		# print(response)
		print(response.choices[0])
		return response.choices[0].message.content

	def simple_chat(self, in_system_prompt, in_user_prompt):
		conversation = [{"role": "system", "content": in_system_prompt}, {"role": "user", "content": in_user_prompt}]
		return self.talk(conversation)


if __name__ == "__main__":
	llm = ChatGPT()
	llm.talk([{"role": "user", "content": "What is the capital of France?"}])
