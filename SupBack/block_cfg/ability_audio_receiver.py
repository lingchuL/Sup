import os.path

from base_class.request_receiver import RequestReceiver
from block_cfg.ability_audio_handle import ItemCfgHandler, EntityCfgHandler, AbilityAudioCfgHandler


class AbilityAudioCfgReceiver(RequestReceiver):
	def init_arg_name_list(self):
		self.arg_name_list = [
			"action",
			"projectDir",
			"search",
			"action_name",
			"desc",
			"castSfx",
			"castSfxTime"
		]

	def handle_action(self):
		result_dict = {}
		if self.arg_dict["action"] == "search_item":
			result_dict = self.search_item()
		elif self.arg_dict["action"] == "search_ability":
			result_dict = self.search_ability()
		elif self.arg_dict["action"] == "write_save_ability":
			result_dict = self.write_save_ability()
		elif self.arg_dict["action"] == "convert_cfg":
			result_dict = self.convert_cfg()
		elif self.arg_dict["action"] == "delete_ability":
			result_dict = self.delete_ability()

		return self.form_response(result_dict)

	def search_item(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		item_cfg_path = os.path.join(project_dir, self.settings.item_relative_path)
		search_name = self.unquote_arg(self.arg_dict["search"])

		item_cfg_handler = ItemCfgHandler()
		item_cfg_handler.load(item_cfg_path, "pk", 0)
		result_dict = item_cfg_handler.search_row_list(search_name)
		return self.form_result_dict(result_dict, "0")

	def search_ability(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		ability_cfg_path = os.path.join(project_dir, self.settings.ability_relative_path)
		item_pk = self.unquote_arg(self.arg_dict["search"])
		action_index = self.arg_dict["action_name"]

		is_search_with_action_name = False
		if action_index is None or action_index == "":
			ability_pk = item_pk
		else:
			action_index_str = action_index[-1]
			ability_pk = f"{item_pk}_{action_index_str}"
			is_search_with_action_name = True

		ability_cfg_handler = AbilityAudioCfgHandler()
		ability_cfg_handler.load(ability_cfg_path, "pk", 6)
		result_list = ability_cfg_handler.search_row_list(ability_pk)

		if is_search_with_action_name:
			if result_list:
				return self.form_result_dict(result_list, "0")
			else:
				item_cfg_path = os.path.join(project_dir, self.settings.item_relative_path)

				item_cfg_handler = ItemCfgHandler()
				item_cfg_handler.load(item_cfg_path, "pk", 0)

				action_index_str = action_index[-1]
				action_tag = item_cfg_handler.get_action_tag(item_pk, action_index_str)
				if action_tag is None or action_tag == "":
					return self.form_result_dict(result_list, "0")

				ability_cfg_handler.set_attr_dict({
					"pk": f"{item_pk}_{action_index_str}",
					"desc": f"{item_pk}0{action_index_str}",
					"abilityTags": "Asset.Item.Tools",
					"blockAbilitiesWithTags": "Asset.Item.Tools",
					"triggerEventTags": action_tag,
					"finishEventTags": "Event.Input.SwitchPose",
					"castSfx": "",
					"castSfxTime": 0
				})
		else:
			item_cfg_path = os.path.join(project_dir, self.settings.item_relative_path)

			item_cfg_handler = ItemCfgHandler()
			item_cfg_handler.load(item_cfg_path, "pk", 0)

			for action_index in range(3):
				action_index_str = str(action_index + 1)
				action_tag = item_cfg_handler.get_action_tag(item_pk, action_index_str)
				print(action_tag)
				if action_tag is None or action_tag == "":
					continue
				ability_row = ability_cfg_handler.search_row_by_id(f"{item_pk}_{action_index_str}")
				if ability_row is not None and ability_row != {}:
					continue
				ability_cfg_handler.set_attr_dict({
					"pk": f"{item_pk}_{action_index_str}",
					"desc": f"{item_pk}0{action_index_str}",
					"abilityTags": "Asset.Item.Tools",
					"blockAbilitiesWithTags": "Asset.Item.Tools",
					"triggerEventTags": action_tag,
					"finishEventTags": "Event.Input.SwitchPose",
					"castSfx": "",
					"castSfxTime": 0
				})

		result_list = ability_cfg_handler.search_row_list(ability_pk)
		return self.form_result_dict(result_list, "0")

	def write_save_ability(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		ability_pk = self.unquote_arg(self.arg_dict["search"])
		item_pk = ability_pk[:-2]
		action_index_str = ability_pk[-1]
		desc = self.arg_dict["desc"]
		cast_sfx = self.arg_dict["castSfx"]
		cast_sfx_time = self.arg_dict["castSfxTime"]

		item_cfg_path = os.path.join(project_dir, self.settings.item_relative_path)
		item_cfg_handler = ItemCfgHandler()
		item_cfg_handler.load(item_cfg_path, "pk", 0)

		ability_cfg_path = os.path.join(project_dir, self.settings.ability_relative_path)
		ability_cfg_handler = AbilityAudioCfgHandler()
		ability_cfg_handler.load(ability_cfg_path, "pk", 6)

		action_tag = item_cfg_handler.get_action_tag(item_pk, action_index_str)
		desc = f"{item_pk}0{action_index_str}" if desc is None or desc == "" else desc

		ability_cfg_handler.set_attr_dict({
			"pk": ability_pk,
			"desc": desc,
			"abilityTags": "Asset.Item.Tools",
			"blockAbilitiesWithTags": "Asset.Item.Tools",
			"triggerEventTags": action_tag,
			"finishEventTags": "Event.Input.SwitchPose",
			"castSfx": cast_sfx,
			"castSfxTime": float(cast_sfx_time)
		})
		ability_cfg_handler.write_save_id(ability_pk)

		entity_pk = item_cfg_handler.get_entity_pk(item_pk)
		entity_cfg_path = os.path.join(project_dir, self.settings.entity_relative_path)

		entity_handler = EntityCfgHandler()
		entity_handler.load(entity_cfg_path, "pk", 0)
		entity_handler.set_ability_or_add(entity_pk, ability_pk)
		# print(f"Entity配置 {entity_handler.search_row_by_id(entity_pk)}")
		entity_handler.write_save_id(entity_pk)

		result_list = ability_cfg_handler.search_row_list(ability_pk[:-2])
		return self.form_result_dict(result_list, "0")

	def convert_cfg(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		rp_bat_path = os.path.join(project_dir, self.settings.convert_rp_cfg_relative_path)
		ability_bat_path = os.path.join(project_dir, self.settings.convert_ability_cfg_relative_path)

		print(rp_bat_path)

		rp_ret_code = self.call_convert_cfg_bat(rp_bat_path)
		ability_ret_code = self.call_convert_cfg_bat(ability_bat_path)

		if rp_ret_code == 0 and ability_ret_code == "0":
			status_code = "0"
		else:
			status_code = "-1"

		return self.form_result_dict("Finished", status_code)

	def delete_ability(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		ability_pk = self.unquote_arg(self.arg_dict["search"])

		ability_cfg_path = os.path.join(project_dir, self.settings.ability_relative_path)
		ability_cfg_handler = AbilityAudioCfgHandler()
		ability_cfg_handler.load(ability_cfg_path, "pk", 6)
		ability_cfg_handler.delete_id(ability_pk)

		item_pk = ability_pk[:-2]
		item_cfg_path = os.path.join(project_dir, self.settings.item_relative_path)
		item_cfg_handler = ItemCfgHandler()
		item_cfg_handler.load(item_cfg_path, "pk", 0)
		entity_pk = item_cfg_handler.get_entity_pk(item_pk)
		entity_cfg_path = os.path.join(project_dir, self.settings.entity_relative_path)

		entity_handler = EntityCfgHandler()
		entity_handler.load(entity_cfg_path, "pk", 0)
		entity_handler.delete_ability(entity_pk, ability_pk)

		result_list = ability_cfg_handler.search_row_list(ability_pk[:-2])
		return self.form_result_dict(result_list, "0")
