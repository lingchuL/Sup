import os
import sys
import subprocess

import base64
import json
import uuid
import requests


class TextToSpeechHandler(object):
	def __init__(self):
		pass

	@staticmethod
	def play_audio(file_path):
		dir_path = os.path.dirname(__file__)
		ffplay_path = os.path.join(os.path.dirname(dir_path), r"ffmpeg\bin\ffplay")
		cmd = rf"{ffplay_path} {file_path} -autoexit -nodisp -hide_banner -loglevel quiet -nostats "
		subprocess.run(cmd, shell=False)


class BytedanceTTS(TextToSpeechHandler):
	def __init__(self):
		super(BytedanceTTS, self).__init__()

		self.app_id = "7748315088"
		self.access_token = "ePDjwgBrrmWpxONfZm1zTh8p7I9J0D4R"
		self.cluster = "volcano_tts"

		self.uid = "test"

		self.voice_type = "BV700_V2_streaming"

		self.url = "https://openspeech.bytedance.com/api/v1/tts"
		self.header = {"Authorization": f"Bearer;{self.access_token}"}

		self.request_json = {}

	def form_request(self, speak_content: str):
		# 帮助文档 https://www.volcengine.com/docs/6561/79823
		self.request_json = {
			"app": {
				"appid": self.app_id,
				"token": self.access_token,
				"cluster": self.cluster
			},
			"user": {
				"uid": self.uid
			},
			"audio": {
				"voice_type": self.voice_type,
				"encoding": "ogg_opus",
				"speed_ratio": 1.1,
				"volume_ratio": 1.0,
				"pitch_ratio": 1.1,
				"emotion": "customer_service",
				"language": "cn"
			},
			"request": {
				"reqid": str(uuid.uuid4()),
				"text": speak_content,
				"text_type": "plain",
				"operation": "query",
			}
		}

	def speak(self, speak_content: str):
		self.form_request(speak_content)
		try:
			resp = requests.post(self.url, json.dumps(self.request_json), headers=self.header)

			if "data" in resp.json():
				ogg_data = resp.json()["data"]
				ogg_file = open("bytedance_speak_temp.ogg", "wb")
				ogg_file.write(base64.b64decode(ogg_data))
				ogg_file.close()

				self.play_audio("bytedance_speak_temp.ogg")

		except Exception as e:
			print(e)


if __name__ == '__main__':
	speaker = BytedanceTTS()
	print(__file__)
	speaker.speak("老大，早上好！")
