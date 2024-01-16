class CopilotSetting(object):
	def __init__(self):
		self.openai_org_id = "org-ZjaUdsUGr8unjw5GPk3jRzSr"
		self.openai_api_key = "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"
		self.one_api_key = "sk-gPGCpBwtd7clLjDYE368D309B3Fa45D38880F633F4DbC895"
		self.one_api_base_url = "https://key.wenwen-ai.com/v1"
		self.http_proxy = "http://127.0.0.1:7890"
		self.https_proxy = "http://127.0.0.1:7890"
		self.start_prompt_template = """
			You are a great AI assistant.
			You NEVER reply explanation unless I told you to explain.
			I'll show you a conversation and provide some functions and their usage description. You should decide:
			What function should be called.
	
			Remember, your reply should ALWAYS be Json string format that could be parsed by Python3 directly.
			
			Here's ALL functions you can choose. DO NOT choose function that's not listed here:
			{func_desc_str}
		"""

		self.start_example = """
			Here's some examples:
			Conversation: "Goodbye"
			Your reply: {"function_name": "end"}
			
			Conversation: "What's the frequency value of note A4?"
			Your reply: {"function_name": "audio"}
		"""

		self.get_func_params_template = """
			You are a great AI assistant.
			You NEVER reply explanation unless I told you to explain.
			I'll show you a conversation and provide a function with its params' descriptions. You should give me:
			A json. Key is the param's name, value is the param's value you got from conversation.
			
			You always return all the params I provided, params those can't get value, just let their value be empty string.
	
			Remember, your reply should ALWAYS be Json string format that could be parsed by Python3 directly.
			
			Here's ALL functions you can choose. DO NOT choose function that's not listed here:
			{func_params_desc_str}
		"""
		self.func_params_example = """
			Here's some examples:
			Conversation: "What's the frequency value of note A4?"
			Your reply: {"note": "A4", "freq": ""}
			Conversation: "What the note name about frequency 440Hz?"
			Your reply: {"freq": "440", "note": ""}
		"""

