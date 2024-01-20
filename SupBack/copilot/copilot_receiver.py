import json

from base_class.request_receiver import RequestReceiver
from copilot.copilot_handle import sup_copilot


class CopilotReceiver(RequestReceiver):
	def __init__(self, in_request):
		super().__init__(in_request)

	def init_arg_name_list(self):
		self.arg_name_list = [
			"action",
			"message"
		]

	def init_action_func_dict(self):
		self.action_func_dict = {
			"talk": self.talk,
			"end": self.end,
			"handle_message": self.handle_message
		}

	def talk(self):
		result = sup_copilot.talk()
		return self.form_result_dict(result)

	def end(self):
		result = sup_copilot.end()
		return self.form_result_dict(result)

	def handle_message(self):
		message = self.unquote_arg(self.arg_dict["message"])
		result = sup_copilot.chat(message)
		return self.form_result_dict(result)
