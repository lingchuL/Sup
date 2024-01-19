from base_class.request_receiver import RequestReceiver
from copilot.copilot_handle import Copilot


class CopilotReceiver(RequestReceiver):
	def init_arg_name_list(self):
		self.arg_name_list = [
			"action",
			"message"
		]

	def init_action_func_dict(self):
		self.action_func_dict = {
			"talk": self.talk,
			"handle_message": self.handle_message
		}

	def talk(self):
		pass

	def handle_message(self):
		message = self.unquote_arg(self.arg_dict["message"])

		copilot = Copilot()
		result = copilot.chat(message)
		return self.form_result_dict(result)
