import re

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

	def search_attr_by_id(self, in_id) -> dict:
		if in_id not in self.rows:
			return {}
		# print(self.rows[in_id])
		return self.rows[in_id]

	def search_attr_rows(self, in_search):
		result_rows = []
		for row in self.rows.values():
			for value in row.values():
				if value is None:
					continue
				str_value = str(value)
				# print(str_value)
				if in_search in str_value:
					result_rows.append(row)
		return result_rows

	def get_sound_param_attr_name(self, id_):
		attr_dict = self.search_attr_by_id(id_)

		rp_interact_attr_name = ""
		first_empty_attr_name = ""

		for attr_name, attr_value in attr_dict.items():
			if "_RPInteract" in str(attr_value):
				rp_interact_attr_name = attr_name

			if attr_value is None and first_empty_attr_name == "":
				first_empty_attr_name = attr_name

		if rp_interact_attr_name == "":
			rp_interact_attr_name = first_empty_attr_name

		return rp_interact_attr_name

	def set_sound_param(self, id_, attr_name, sound_list: [str], param_name="sfx_start"):
		attr_dict = self.search_attr_by_id(id_)

		old_sound_param = ""
		attr_value = attr_dict[attr_name]

		sound_param = ""
		for sound in sound_list:
			sound_param += sound + '/'
		if sound_param != "":
			sound_param = sound_param[:-1]
			sound_param = f",{param_name}=str?'{sound_param}'"
			if old_sound_param != "":
				attr_dict[attr_name] = attr_value.replace(old_sound_param, sound_param)
			else:
				attr_dict[attr_name] += sound_param

	def set_rp_interact_sound(self, id_: str, sfx_start_sounds: [str], sfx_end_sounds: [str]):
		if sfx_start_sounds is None and sfx_end_sounds is None:
			return
		if sfx_start_sounds == [] and sfx_end_sounds == []:
			return

		rp_interact_attr_name = self.get_sound_param_attr_name(id_)

		self.set_sound_param(id_, rp_interact_attr_name, sfx_start_sounds, "sfx_start")
		self.set_sound_param(id_, rp_interact_attr_name, sfx_end_sounds, "sfx_end")

		print(self.search_attr_by_id(id_))


if __name__ == "__main__":
	interact_audio_cfg_handler = InteractAudioCfgHandler()
	interact_audio_cfg_handler.load(r"E:\Workflow\Block-wangjunyi.42-trunk\Client\Data\JungoTownRP\1_体素配置_RP.xlsx")
	interact_audio_cfg_handler.init_attr("id")
	print(interact_audio_cfg_handler.xlsx_handler.attr_names)
	# pprint(interact_audio_cfg_handler.rows)
	# interact_audio_cfg_handler.search_attr("GrayRoof")
	# interact_audio_cfg_handler.search_attr("Piano")
	# interact_audio_cfg_handler.search_attr_rows("_RPInteract")
	interact_audio_cfg_handler.set_rp_interact_sound("Piano", [], ["CH_GasStove_Skill_Off", "CH_GasStove_Skill_On"])
