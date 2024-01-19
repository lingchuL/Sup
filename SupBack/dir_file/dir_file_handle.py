import os

from pprint import pprint

# noinspection PyUnresolvedReferences
from win32com.shell import shell, shellcon


class DirFileHandler(object):
	def __init__(self):
		self.dir_path = ""

		self.file_size_dict = {}

		self.last_load_path = ""
		self.last_is_recursively = False

	@staticmethod
	def is_same_path(a_path, b_path):
		return os.path.abspath(a_path) == os.path.abspath(b_path)

	@staticmethod
	def get_readable_size(byte_size):
		kb = 1024
		mb = kb * 1024
		gb = mb * 1024
		tb = gb * 1024
		if byte_size >= tb:
			return "%.2fTB" % float(byte_size / tb)
		if byte_size >= gb:
			return "%.2fGB" % float(byte_size / gb)
		if byte_size >= mb:
			return "%.2f MB" % float(byte_size / mb)
		if byte_size >= kb:
			return "%.2fKB" % float(byte_size / kb)

	@staticmethod
	def get_all_files_full_path(in_dir, is_recursively=False):
		all_files = []
		for root, dirs, files in os.walk(in_dir):
			for file_name in files:
				file_full_path = os.path.join(root, file_name)
				all_files.append(file_full_path)
			if not is_recursively:
				break
		return all_files

	@staticmethod
	def open_explorer_and_select(file_full_path):
		if not os.path.isfile(file_full_path):
			return

		os.system(f"explorer /n,/select,\"{file_full_path}\"")

	@staticmethod
	def sort_dict_by_value(in_dict, is_high_to_low=True) -> list:
		return sorted(in_dict.items(), key=lambda kv: (kv[1], kv[0]), reverse=is_high_to_low)

	def load_file_size_dict(self, is_recursively=False):
		if self.last_load_path == self.dir_path and self.last_is_recursively == is_recursively:
			return

		self.last_load_path = self.dir_path
		self.last_is_recursively = is_recursively
		self.file_size_dict.clear()

		for file_full_path in self.get_all_files_full_path(self.dir_path, is_recursively):
			# self.file_size_dict[file_full_path] = self.get_readable_size(os.path.getsize(file_full_path))
			self.file_size_dict[file_full_path] = os.path.getsize(file_full_path)

	def list_file_in_size_order(self, in_dir: str, search_name: str, is_recursively=True, is_high_to_low=True):
		# print(is_recursively)
		self.dir_path = in_dir.strip()
		if self.dir_path == "":
			return

		is_search = False if search_name == "" else True

		# 加载所有文件大小
		self.load_file_size_dict(is_recursively)

		sorted_file_list = []
		total_size = 0
		for file_size_tuple in self.sort_dict_by_value(self.file_size_dict, is_high_to_low):
			# 过滤出搜索项
			if is_search and (search_name not in file_size_tuple[0]):
				continue

			total_size += file_size_tuple[1]
			sorted_file_list.append(
				{"file_full_path": file_size_tuple[0], "file_size": self.get_readable_size(file_size_tuple[1])})

		resp_dict = {"answer": sorted_file_list, "total_size": self.get_readable_size(total_size), "status": "0"}

		return resp_dict


class ShellDirHandler(object):
	def __init__(self):
		pass

	def get_all_files_full_path(self, in_dir):
		desktop_shell_folder = shell.SHGetDesktopFolder()
		enum_obj = desktop_shell_folder.EnumObjects(None, shellcon.SHCONTF_FOLDERS | shellcon.SHCONTF_NONFOLDERS)
		while True:
			pids = enum_obj.Next()
			if pids is None or pids == []:
				break
			for pid in pids:
				# print(pid)
				print(desktop_shell_folder.GetDisplayNameOf(pid, shellcon.SHGDN_INFOLDER | shellcon.SHGDN_FOREDITING))
				# print(pid[0].decode("ascii"))


if __name__ == "__main__":
	# dir_handler = DirHandler()
	# file_size_dict = dir_handler.list_file_in_size_order(r"D:\_record", False)
	#
	# result = ""
	# for file_size_object in file_size_dict["answer"]:
	# 	file = file_size_object["file_full_path"]
	# 	size = file_size_object["file_size"]
	# 	result += f"{file}\t{size}\n"
	#
	# print(result)
	shell_dir_handler = ShellDirHandler()
	shell_dir_handler.get_all_files_full_path("")

