import os
import json
from pprint import pprint

bgm_state_dict_template = {
	'classType': 'DTree.DTLayer',
	'interval': 5,
	'name': 'BGM',
	'root': {
		'classType': 'DTree.DTNode',
		'conditions': [],
		'name': 'Base',
		'results': [{
			'blendInTime': 0,
			'blendOutTime': 0,
			'classType': 'DTree.DTResult',
			'resultType': 'BGM',
			'resultValue': {
				'boolValue': False,
				'classType': 'DTree.DTResultValueDefinition',
				'floatValue': 0,
				'intValue': 0,
				'stringValue': 'BGM_Scene_Survival',
				'valueType': 'String'
			},
			'transitTime': 0
		}],
		'subStates': []
	}
}

sub_state_dict_template = {
	"classType": "DTree.DTNode",
	"name": "Plains",
	"subStates": [],
	"conditions": [{
		"classType": "DTree.DTConditionBase",
		"methodName": "CheckBiomeTags",
		"parameters": "Asset.Biomes.Plains"
	}],
	"results": [{
		"classType": "DTree.DTResult",
		"resultType": "BGM",
		"resultValue": {
			"classType": "DTree.DTResultValueDefinition",
			"valueType": "String",
			"intValue": 0,
			"floatValue": 0,
			"stringValue": "BGM_Scene_Survival",
			"boolValue": False
		},
		"blendInTime": 0,
		"blendOutTime": 0,
		"transitTime": 0
	}]
}


class EnvTreeHandler(object):
	def __init__(self):
		self.env_cfg_dict = {}
		self.bgm_cfg_dict = {}

		self.env_full_path = ""

	@staticmethod
	def is_valid_env_file(env_full_path):
		if not os.path.exists(env_full_path) or not os.path.isfile(env_full_path):
			return False
		return True

	def load_env_tree(self, in_dir, in_game_name):
		if not os.path.isdir(in_dir):
			return
		env_tree_path = os.path.join(in_dir, "Client/Data", in_game_name, "_NativeConfig/EnvDTree.dtree")
		if not self.is_valid_env_file(env_tree_path):
			return

		self.env_full_path = env_tree_path

		with open(self.env_full_path, "r", encoding="utf-8") as env_f:
			self.env_cfg_dict = json.load(env_f)

		# pprint(self.env_cfg_dict)
		self.load_bgm_config()
		self.load_bgm_sub_states()

	def load_bgm_config(self):
		if "_layers" not in self.env_cfg_dict or "arrayValue" not in self.env_cfg_dict["_layers"]:
			return

		for cfg in self.env_cfg_dict["_layers"]["arrayValue"]:
			if "name" not in cfg or cfg["name"] != "BGM":
				continue
			# pprint(cfg)
			self.bgm_cfg_dict = cfg
			break

	def load_bgm_sub_states(self):
		if "root" not in self.bgm_cfg_dict or "subStates" not in self.bgm_cfg_dict["root"]:
			return

		for sub_state in self.bgm_cfg_dict["root"]["subStates"]:
			# print(sub_state["name"])
			# pprint(sub_state)
			pass

	@staticmethod
	def is_sub_state_in_state(sub_state_name, state_dict):
		if "root" not in state_dict or "subStates" not in state_dict["root"]:
			return False
		for sub_state in state_dict["root"]["subStates"]:
			if sub_state["name"] == sub_state_name:
				return True
		return False

	def get_bgm_state_index(self) -> int:
		if "root" not in self.env_cfg_dict or "subStates" not in self.env_cfg_dict["root"]:
			return -1
		bgm_index = 0
		for sub_state in self.env_cfg_dict["root"]["subStates"]:
			if sub_state["name"] == "BGM":
				return bgm_index
			bgm_index += 1
		return -1

	def add_bgm_state(self):
		if "root" not in self.env_cfg_dict or "subStates" not in self.env_cfg_dict["root"]:
			return
		if self.get_bgm_state_index() != -1:
			return

		pass

	def add_bgm_sub_states(self, in_name):
		if self.is_sub_state_in_state(in_name, self.bgm_cfg_dict):
			return
		sub_cfg_dict = sub_state_dict_template
		sub_cfg_dict["name"] = in_name
		sub_cfg_dict["conditions"][0]["methodName"] = "CheckInAABB"
		sub_cfg_dict["conditions"][0]["parameters"] = "571,53,-802,631,85,-755"
		sub_cfg_dict["results"][0]["resultValue"]["stringValue"] = "BGM_Scene_AbandonedBuilding"

		self.bgm_cfg_dict["root"]["subStates"].append(sub_cfg_dict)
		# self.env_cfg_dict[]

		bgm_index = self.get_bgm_state_index()
		if bgm_index == -1:
			print(f"add_bgm_sub_states 当前决策树不包含BGM节点")
			return

		self.env_cfg_dict["_layers"]["arrayValue"].pop(bgm_index)
		self.env_cfg_dict["_layers"]["arrayValue"].append(self.bgm_cfg_dict)

		print(self.env_cfg_dict)
		# print(json.dumps(self.env_cfg_dict))

	@staticmethod
	def cfg_str_syntax_check(cfg_str) -> str:
		out_cfg_str = cfg_str
		out_cfg_str = out_cfg_str.replace(":", " :")
		out_cfg_str = out_cfg_str.replace("}}, {", " } },{")
		out_cfg_str = out_cfg_str.replace("{", "{ ")
		out_cfg_str = out_cfg_str.replace("}", " }")
		# out_cfg_str = out_cfg_str.replace("\"resultType\" :", "\"resultType\" : ")
		# out_cfg_str = out_cfg_str.replace("\"valueType\" :", "\"valueType\" : ")
		out_cfg_str = out_cfg_str.replace("\"arrayValue\" : ", "\"arrayValue\" :")
		out_cfg_str = out_cfg_str.replace(", { \"classType\"", ",{ \"classType\"")
		out_cfg_str = out_cfg_str.replace("}]  }  },{", "}] } },{")
		out_cfg_str = out_cfg_str.replace("}] } }] } }", "}] } }]} }")

		return out_cfg_str

	def save_env_tree(self):
		if not self.is_valid_env_file(self.env_full_path):
			return
		cfg_str = self.cfg_str_syntax_check(json.dumps(self.env_cfg_dict))
		pprint(self.env_cfg_dict)
		# print(cfg_str)
		with open(self.env_full_path, "w+", encoding="utf-8") as env_f:
			env_f.write(cfg_str)


if __name__ == "__main__":
	block_cfg_handler = EnvTreeHandler()
	block_cfg_handler.load_env_tree(r"E:\Workflow\Block-wangjunyi.42-trunk", "JungoTownRP")
	block_cfg_handler.add_bgm_sub_states("AbandonedBuilding")
	block_cfg_handler.save_env_tree()
