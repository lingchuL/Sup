import copy

from copilot.llm_handle import ChatGPT

from settings.copilot_setting import CopilotSetting


class ChatHandler(object):
	def __init__(self, in_setting=CopilotSetting()):
		self.setting = in_setting
		self.chat_msg_list = []
		self.awake = False

	def get_history_str(self):
		chat_history = ""
		for chat in self.chat_msg_list:
			role = chat["role"]
			content = chat["content"]
			chat_history += f"{role}: {content}\n"
		return chat_history

	def get_full_msg_list(self, system_prompt):
		system_msg = [{"role": "system", "content": system_prompt}]
		return system_msg + copy.deepcopy(self.chat_msg_list)

	def add_chat(self, role, content):
		if not self.awake:
			return
		self.chat_msg_list.append({"role": role, "content": content})

	def wake_up(self):
		self.awake = True

	def end_chat(self):
		print("flush chat")
		self.chat_msg_list.clear()
		self.awake = False
