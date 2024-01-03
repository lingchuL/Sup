import os

import math

from openpyxl import Workbook, load_workbook

from log_handle import SupLogger


class ColumnNumHandler(object):
	def __init__(self):
		pass

	@staticmethod
	def single_chr_num(in_chr):
		return ord(in_chr) - ord("A") + 1

	@staticmethod
	def single_num_chr(in_num):
		return chr(in_num + ord("A"))

	def num_of_col(self, in_column):
		digit_len = len(in_column)
		num = 0
		for i in range(digit_len):
			if not in_column[i].isalpha():
				return
			num += self.single_chr_num(in_column[i]) * (26 ** (digit_len - i - 1))
		return num

	def col_of_num(self, in_num: int):
		if in_num < 1:
			SupLogger.info("invalid column num")
			return ""
		div, mod = divmod(in_num - 1, 26)
		return self.single_num_chr(div - 1) + self.single_num_chr(mod) if div else self.single_num_chr(mod)


class XlsxHandler(object):
	def __init__(self):
		self.wb = None
		self.ws = None

		self.attr_names = []
		self.attr_columns = []

		self.attrs = []

		self.col_handler = ColumnNumHandler()

		self.max_row = 0
		self.max_col = 0

	@staticmethod
	def is_valid_xlsx(in_file_path):
		return os.path.isfile(in_file_path) and os.path.exists(in_file_path) and in_file_path.endswith('.xlsx')

	def load(self, in_file_path, sheet_index=0, is_data_only=True):
		if not self.is_valid_xlsx(in_file_path):
			return

		self.wb = load_workbook(in_file_path, data_only=is_data_only)

		ws_i = 0
		for sheet in self.wb:
			if ws_i == sheet_index:
				self.ws = sheet
				break
			ws_i += 1

		self.max_row = self.ws.max_row
		self.max_col = self.ws.max_column

	def get_cell_of_col_num(self, col_num: int, row_num: int):
		col = self.col_handler.col_of_num(col_num)
		cell_index = col + str(row_num)
		return self.ws[cell_index].value

	def get_cell_of_col(self, col: str, row_num: int):
		cell_index = col + str(row_num)
		return self.ws[cell_index].value
			
	def get_row_of_columns(self, col_range: [str], row):
		if self.ws is None:
			return

		if len(col_range) != 2:
			SupLogger.info("col range must be two")

		row_values = []

		col_min = self.col_handler.num_of_col(col_range[0])
		col_max = self.col_handler.num_of_col(col_range[1])

		column_nums = range(col_min, col_max + 1, 1)

		for column_num in column_nums:
			col = self.col_handler.col_of_num(column_num)
			if col not in self.attr_columns:
				self.attr_columns.append(col)
			cell_index = col + row
			cell_value = self.ws[cell_index].value
			row_values.append(cell_value)

		return row_values

	def add_attr_name(self, attr_name_columns: [str], attr_name_row: str):
		if self.ws is None:
			return

		for attr_name in self.get_row_of_columns(attr_name_columns, attr_name_row):
			if attr_name not in self.attr_names:
				self.attr_names.append(attr_name)

	def init_attr(self):
		for i_row in range(self.ws.max_row):
			for attr_name in self.attr_names:
				attr = {}
				for attr_column in self.attr_columns:
					col_num = self.col_handler.num_of_col(attr_column)
					col = self.col_handler.col_of_num(col_num)
					cell_index = col + str(i_row + 1)
					cell_value = self.ws[cell_index].value
					attr[attr_name] = cell_value
				self.attrs.append(attr)


if __name__ == "__main__":
	xlsx_handler = XlsxHandler()
	xlsx_handler.load(r"E:\Workflow\Block-wangjunyi.42-trunk\Client\Data\JungoTownRP\1_体素配置_RP.xlsx")
	xlsx_handler.add_attr_name(["C", "E"], "3")
	print(xlsx_handler.attr_names)
	column_handler = ColumnNumHandler()
	# print(column_handler.num_of_col("AZ"))
	print(column_handler.col_of_num(1))
	print(column_handler.col_of_num(26))
	print(column_handler.col_of_num(53))
	print(xlsx_handler.max_row)
