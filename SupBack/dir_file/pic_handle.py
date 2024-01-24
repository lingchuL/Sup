import os

from PIL import Image


class PicHandler(object):
	def __init__(self):
		pass

	def transform_to_png(self, pic_path: str):
		if pic_path.endswith(".jfif"):
			self.jfif_to_png(pic_path)
		elif pic_path.endswith(".webp"):
			self.webp_to_png(pic_path)
		else:
			print(f"Unsupported file format: {os.path.splitext(pic_path)[1]} {pic_path}")

	@staticmethod
	def jfif_to_png(jfif_path):
		if not os.path.isfile(jfif_path):
			return

		img = Image.open(jfif_path)
		png_path = os.path.splitext(jfif_path)[0] + ".png"
		img.save(png_path)

	@staticmethod
	def webp_to_png(webp_path):
		if not os.path.isfile(webp_path):
			return

		img = Image.open(webp_path)
		# img.load()
		png_path = os.path.splitext(webp_path)[0] + ".png"
		print(img.getbands())
		img.save(png_path)
