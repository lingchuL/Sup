from excel.xlsx_handle import XlsxHandler

from pprint import pprint


class InteractAudioCfgHandler(object):
	def __init__(self):
		self.xlsx_handler = XlsxHandler()

		self.rows = {}

	def load(self, in_cfg_path):
		self.xlsx_handler.load(in_cfg_path)
		self.xlsx_handler.add_attr_name(["C", "D"], "4")
		self.xlsx_handler.add_attr_name(["B", "B"], "4")
		self.xlsx_handler.add_attr_name(["AL", "AU"], "3")

	def init_attr(self, main_key_name: str):
		for i_row in range(self.xlsx_handler.ws.max_row):
			i_attr_column = 0
			row = {}
			for attr_column in self.xlsx_handler.attr_columns:
				cell_value = self.xlsx_handler.get_cell_of_col(attr_column, i_row + 1)
				attr_name = self.xlsx_handler.attr_names[i_attr_column]
				row[attr_name] = cell_value
				i_attr_column += 1
			self.rows[row[main_key_name]] = row

	def search_attr(self, in_id):
		if in_id not in self.rows:
			return
		print(self.rows[in_id])

	def search_rows(self, in_search):
		for row in self.rows.values():
			for value in row.values():
				if value is None:
					continue
				str_value = str(value)
				# print(str_value)
				if in_search in str_value:
					print(row)


if __name__ == "__main__":
	interact_audio_cfg_handler = InteractAudioCfgHandler()
	interact_audio_cfg_handler.load(r"E:\Workflow\Block-wangjunyi.42-trunk\Client\Data\JungoTownRP\1_体素配置_RP.xlsx")
	interact_audio_cfg_handler.init_attr("id")
	print(interact_audio_cfg_handler.xlsx_handler.attr_names)
	# pprint(interact_audio_cfg_handler.rows)
	# interact_audio_cfg_handler.search_attr("GrayRoof")
	# interact_audio_cfg_handler.search_attr("Piano")
	interact_audio_cfg_handler.search_rows("_RPInteract")
