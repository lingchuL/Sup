import math


class BPMHandler(object):
	def __init__(self):
		pass

	@staticmethod
	def spb_of_bpm(in_bpm: float):
		"""
		:param self:
		:param in_bpm: BPM
		:return: 输入BPM对应的SPB，每拍的秒数
		"""
		return 60.0 / in_bpm

	@staticmethod
	def bpm_of_spb(in_spb: float):
		return 60.0 / in_spb


if __name__ == '__main__':
	spb = BPMHandler.spb_of_bpm(180)
	print(spb)
	bpm = BPMHandler.spb_of_bpm(1.04)
	print(bpm)

