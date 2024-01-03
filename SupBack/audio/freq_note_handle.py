import math


class FreqNoteTrans(object):
	def __init__(self):
		notes_sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
		notes_flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
		self.notes_index_sharp_dict = {}
		self.notes_index_flat_dict = {}

		for note in notes_sharp:
			self.notes_index_sharp_dict[note] = notes_sharp.index(note)

		for note in notes_flat:
			self.notes_index_flat_dict[note] = notes_flat.index(note)

		self.standard_freq = 440
		self.standard_note_name_index = self.notes_index_sharp_dict["A"]

	@staticmethod
	def get_note_name(in_note: str):
		note_name = in_note[:-1]
		note_height = in_note[-1]
		return note_name

	def get_note_name_index(self, in_note_name: str):
		if in_note_name in self.notes_index_sharp_dict:
			return self.notes_index_sharp_dict[in_note_name]
		if in_note_name in self.notes_index_flat_dict:
			return self.notes_index_flat_dict[in_note_name]

		print(f"FreqNoteTrans get_note_index 音名格式错误:{in_note_name}")
		return 0

	def get_note_index(self, in_note: str):
		note_name = self.get_note_name(in_note)
		return self.get_note_name_index(note_name)

	def get_note_pitch_interval(self, note_a: str, note_b: str):
		note_a_index = self.get_note_index(note_a)
		note_b_index = self.get_note_index(note_b)

		note_a_height = int(note_a[-1])
		note_b_height = int(note_b[-1])

		height_interval = note_b_height - note_a_height

		note_pitch_interval = (note_b_index - note_a_index) + height_interval * 12

		# print(f"FreqNoteTrans get_note_pitch_interval {note_a}与{note_b}音程为{note_pitch_interval}个半音")

		return note_pitch_interval

	def get_index_note(self, in_index):
		for key, value in self.notes_index_sharp_dict.items():
			if value == in_index:
				return key

		print(f"FreqNoteTrans get_index_note 音高索引{in_index}未找到对应音名")
		return ""

	def get_near_note(self, in_freq: float):
		freq_times = in_freq / self.standard_freq
		note_interval = round(math.log(freq_times, math.pow(2, 1 / 12)))

		# print(f"FreqNoteTrans get_near_note 频率{in_freq}对应音程{note_interval}个半音")

		height_interval = round(note_interval / 12)
		index_interval = note_interval % 12

		height = 4 + height_interval
		note_name_index = self.standard_note_name_index + index_interval
		note_name_index %= 12
		note_name = self.get_index_note(note_name_index)

		note = f"{note_name}{height}"

		print(f"FreqNoteTrans get_near_note 频率{in_freq}最接近的音高: {note}")

		return note

	def get_note_freq(self, in_note):
		note_interval = self.get_note_pitch_interval("A4", in_note)

		note_freq = self.standard_freq * math.pow(2, note_interval / 12)

		print(f"FreqNoteTrans get_note_freq 音高{in_note}频率: {note_freq}")
		return note_freq


if __name__ == "__main__":
	freq_note_trans = FreqNoteTrans()
	freq_note_trans.get_note_freq("A4")
	freq_note_trans.get_near_note(784)

