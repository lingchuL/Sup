from flask import Response

from base_class.request_receiver import RequestReceiver
from dir_file.dir_file_handle import DirFileHandler


class DirFileReceiver(RequestReceiver):
	def init_arg_name_list(self):
		self.arg_name_list = [
			"path",
			"action",
			"recursively",
			"search",
		]

	def init_action_func_dict(self):
		self.action_func_dict = {
			"open_file": self.open_file,
			"get_file_size_list": self.get_file_size_list,
			"get_search_file_size_list": self.get_search_file_size_list,
		}

	def open_file(self):
		path = self.arg_dict["path"]
		dir_file_handler = DirFileHandler()
		dir_file_handler.open_explorer_and_select(path)
		return self.form_result_dict("Finished")

	def get_file_size_list(self):
		path = self.unquote_arg(self.arg_dict["path"])
		search = self.unquote_arg(self.arg_dict["search"])
		recursively = self.arg_dict["recursively"]
		if recursively is None:
			recursively = True
		is_recursively = (recursively in ["true", "True", "1"])

		dir_file_handler = DirFileHandler()

		return self.form_result_dict(dir_file_handler.list_file_in_size_order(path, search, is_recursively))

	def get_search_file_size_list(self):

		search = self.unquote_arg(self.arg_dict["search"])

		print(f"get_file_size_list 得到search search_param: {search}")
		if search is None:
			return self.form_response({"result": "missing_search_param", "status": "-1"})

		dir_file_handler = DirFileHandler()

		path = self.unquote_arg(self.arg_dict["path"])
		recursively = self.arg_dict["recursively"]

		if recursively is None:
			recursively = True
		recursively = (recursively in ["true", "True", "1"])

		return self.form_result_dict(dir_file_handler.list_file_in_size_order(path, search, recursively))

