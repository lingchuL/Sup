from abc import ABC, abstractmethod

from flask import Response, Request


class RequestReceiver(object):
	def __init__(self, in_request_args: Request.args):
		self.request_args = in_request_args
		self.arg_name_list = []
		self.arg_dict = {}

		self.init_arg_name_list()
		self.init_arg_dict()

	@abstractmethod
	def init_arg_name_list(self):
		pass

	def init_arg_dict(self):
		for arg_name in self.arg_name_list:
			if arg_name in self.request_args:
				self.arg_dict[arg_name] = self.request_args[arg_name]
			else:
				self.arg_dict[arg_name] = ""

