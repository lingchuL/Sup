import re

from base_class.cfg_handler import CfgHandler


class InteractAudioCfgHandler(CfgHandler):
	def add_attr_names(self):
		self.xlsx_handler.add_attr_name(["C", "D", "B"], 4)
		self.xlsx_handler.add_attr_name_by_range(["AL", "AU"], 3)

	def form_row_dict(self, in_row):
		row_id = in_row["id"]
		row_dict = {
			"id_": in_row["id"],
			"desc": in_row["名字"],
			"guid": in_row["guid"],
			"sfx_start": self.get_sound_param(row_id, "sfx_start"),
			"sfx_end": self.get_sound_param(row_id, "sfx_end"),
		}
		return row_dict

	def get_sound_param_attr_name(self, id_):
		attr_dict = self.search_attr_by_id(id_)
		print(attr_dict)

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

	def get_sound_param(self, id_, param_name):
		attr_dict = self.search_attr_by_id(id_)

		for attr_name, attr_value in attr_dict.items():
			if "_RPInteract" in str(attr_value):
				search_result = re.search(rf",{param_name}=str\?'.*?',", attr_value + ",")
				old_sound_param = search_result.group(0)[len(rf",{param_name}=str\?'") - 1:-2] if search_result else ""

				return old_sound_param

		return ""

	def set_sound_param(self, id_, attr_name, sound_param_str: str, param_name="sfx_start"):
		attr_dict = self.search_attr_by_id(id_)

		attr_value = attr_dict[attr_name]
		if attr_value is None:
			attr_value = ""

		search_result = re.search(rf",{param_name}=str\?'.*?',", attr_value + ",")
		old_sound_param = search_result.group(0)[:-1] if search_result else ""

		sound_param = f",{param_name}=str?'{sound_param_str}'"

		if attr_value == "":
			attr_value = "_RPInteract:"
			sound_param = sound_param[1:]

		if old_sound_param != "":
			attr_dict[attr_name] = attr_value.replace(old_sound_param, sound_param)
		else:
			attr_dict[attr_name] = attr_value + sound_param

	def remove_sound_param(self, id_, attr_name, param_name):
		attr_dict = self.search_attr_by_id(id_)

		search_result = re.search(rf",{param_name}=str\?'.*?',", attr_dict[attr_name] + ",")
		old_sound_param = search_result.group(0)[:-1] if search_result else ""
		attr_value = attr_dict[attr_name]

		if old_sound_param != "":
			attr_dict[attr_name] = attr_value.replace(old_sound_param, "")

	def set_rp_interact_sound(self, id_: str, sound_param_str: str, in_param_name):
		if sound_param_str == "":
			return

		print(id_)
		rp_interact_attr_name = self.get_sound_param_attr_name(id_)
		print(rp_interact_attr_name)

		self.set_sound_param(id_, rp_interact_attr_name, sound_param_str, in_param_name)

		print(self.search_attr_by_id(id_))

	def remove_rp_interact_sound(self, id_: str, in_param_name: str):
		if in_param_name == "":
			return

		rp_interact_attr_name = self.get_sound_param_attr_name(id_)
		self.remove_sound_param(id_, rp_interact_attr_name, in_param_name)
		print(self.search_attr_by_id(id_))

	def write_save_id(self, id_):
		row_num = self.row_nums[id_]
		attr_dict = self.search_attr_by_id(id_)
		self.xlsx_handler.write_save_row(row_num, attr_dict)

	def write_save_cell(self, id_, attr_name):
		row_num = self.row_nums[id_]
		col = self.xlsx_handler.get_attr_col_by_name(attr_name)
		self.xlsx_handler.write_save_cell(col, row_num, self.search_attr_by_id(id_)[attr_name])


if __name__ == "__main__":
	interact_audio_cfg_handler = InteractAudioCfgHandler()
	interact_audio_cfg_handler.load(r"E:\Workflow\Block-wangjunyi.42-trunk\Client\Data\JungoTownRP\1_体素配置_RP.xlsx", "id")
	print(interact_audio_cfg_handler.xlsx_handler.attr_names)
	# pprint(interact_audio_cfg_handler.rows)
	# pprint(interact_audio_cfg_handler.search("Drum_Stand_Instrument"))
	# interact_audio_cfg_handler.set_rp_interact_sound("Piano", "HO_Drum_Skill_Play2", "sfx_start")
	# interact_audio_cfg_handler.set_rp_interact_sound("Piano", ["HO_Drum_Skill_Play"], "sfx_start")
	# interact_audio_cfg_handler.set_rp_interact_sound("Piano", ["HO_Drum_Skill_Play", "HO_Guitar_Skill_Play"], "sfx_end")
	# interact_audio_cfg_handler.remove_rp_interact_sound("Piano", "sfx_start")
	interact_audio_cfg_handler.write_save_id("Drum_Stand_Instrument")
