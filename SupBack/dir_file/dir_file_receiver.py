import json

from flask import Response

from base_class.request_receiver import RequestReceiver
from dir_file.dir_file_handle import DirFileHandler
from dir_file.pic_handle import PicHandler
from dir_file.adb_handle import ADBHandler


class DirFileReceiver(RequestReceiver):
	def init_arg_name_list(self):
		self.arg_name_list = [
			"path",
			"action",
			"recursively",
			"search",
			"file_list",
			"apk_path"
		]

	def init_action_func_dict(self):
		self.action_func_dict = {
			"open_file": self.open_file,
			"get_file_size_list": self.get_file_size_list,
			"get_search_file_size_list": self.get_search_file_size_list,
			"transform_pic": self.transform_pic,
			"install_block": self.install_block,
		}

	def open_file(self):
		path = self.unquote_arg(self.arg_dict["path"])
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

	def transform_pic(self):
		file_list_json = self.arg_dict["file_list"]
		file_list = json.loads(file_list_json)
		print(file_list)
		for file_info_dict in file_list:
			print(file_info_dict)
			file_full_path = file_info_dict["file_full_path"]
			pic_handler = PicHandler()
			pic_handler.transform_to_png(file_full_path)

		return self.form_result_dict("Finished")

	def install_block(self):
		apk_path = self.unquote_arg(self.arg_dict["apk_path"])
		adb_handler = ADBHandler()
		adb_handler.uninstall("com.block.jungojam")
		adb_handler.install(apk_path)
