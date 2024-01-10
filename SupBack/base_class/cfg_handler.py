from abc import ABC, abstractmethod

from excel.xlsx_handle import XlsxHandler


class CfgHandler(object):
	def __init__(self):
		self.xlsx_handler = XlsxHandler()

		self.rows = {}
		self.row_nums = {}

	def load(self, in_cfg_path, main_key_name: str, sheet_index=0):
		self.xlsx_handler.load(in_cfg_path, sheet_index)
		self.add_attr_names()
		self.init_main_key(main_key_name)

	@abstractmethod
	def add_attr_names(self):
		pass

	def init_main_key(self, main_key_name: str):
		for i_row in range(self.xlsx_handler.ws.max_row):
			row = {}
			for attr_column in self.xlsx_handler.attr_columns:
				cell_value = self.xlsx_handler.get_cell_of_col(attr_column, i_row + 1)
				attr_name = self.xlsx_handler.get_attr_name_by_col(attr_column)
				row[attr_name] = cell_value
			assert main_key_name in row
			self.rows[row[main_key_name]] = row
			self.row_nums[row[main_key_name]] = i_row + 1

	def close(self):
		self.xlsx_handler.close()

	def search_row_by_id(self, in_id) -> dict:
		if in_id not in self.rows:
			return {}
		# print(self.rows[in_id])
		return self.rows[in_id]

	def search(self, in_search):
		result_rows = []
		for row in self.rows.values():
			for value in row.values():
				if value is None:
					continue
				if in_search in str(value):
					result_rows.append(row)
					break
		return result_rows

	def get_row_dict_list(self, in_main_key_value):
		rows = self.search(in_main_key_value)
		result_rows = []

		for row in rows:
			result_rows.append(self.form_row_dict(row))

		return result_rows

	def form_row_dict(self, in_row: dict) -> dict:
		result_dict = {}
		for attr_name in self.xlsx_handler.attr_names:
			assert attr_name in in_row
			result_dict[attr_name] = in_row[attr_name]

		return result_dict

	def get_first_match_attr_name(self, in_main_key_value, in_match_str):
		attr_dict = self.search_row_by_id(in_main_key_value)

		first_match_attr_name = ""
		first_empty_attr_name = ""

		for attr_name, attr_value in attr_dict.items():
			if in_match_str in str(attr_value):
				first_match_attr_name = attr_name
				break

			if attr_value is None and first_empty_attr_name == "":
				first_empty_attr_name = attr_name

		if first_match_attr_name == "":
			first_match_attr_name = first_empty_attr_name

		return first_match_attr_name

	def set_row_dict(self, in_main_key_value: str, in_row: dict):
		if in_main_key_value not in self.rows:
			last_row_num = list(self.row_nums.keys())[-1]
			self.row_nums[in_main_key_value] = self.row_nums[last_row_num] + 1

		self.rows[in_main_key_value] = in_row

	def write_save_id(self, in_main_key_value):
		row_num = self.row_nums[in_main_key_value]
		attr_dict = self.search_row_by_id(in_main_key_value)
		self.xlsx_handler.write_save_row_win32com(row_num, attr_dict)

	def write_save_cell(self, in_main_key_value, attr_name):
		row_num = self.row_nums[in_main_key_value]
		col = self.xlsx_handler.get_attr_col_by_name(attr_name)
		self.xlsx_handler.write_save_cell(col, row_num, self.search_row_by_id(in_main_key_value)[attr_name])
