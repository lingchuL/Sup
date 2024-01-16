import os
import sys
import subprocess

import base64
import json
import uuid
import requests


class Speaker(object):
	def __init__(self):
		pass

	@staticmethod
	def play_audio(file_path):
		dir_path = os.path.dirname(__file__)
		ffplay_path = os.path.join(os.path.dirname(dir_path), r"ffmpeg\bin\ffplay")
		cmd = rf"{ffplay_path} {file_path} -autoexit -nodisp -hide_banner -loglevel quiet -nostats "
		subprocess.run(cmd, shell=False)
