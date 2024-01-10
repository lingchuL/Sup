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

	def search_attr_by_id(self, in_id) -> dict:
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

	def get_cfg_dict(self, in_main_key_value):
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
