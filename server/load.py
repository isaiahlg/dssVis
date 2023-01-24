import h5py
import numpy as np
# import pandas as pd

print("starting script")
filename = 'data/p13uhs0_1247/store.h5'
print("loading hdf5 file")
f = h5py.File(filename, 'r+')
print("loaded hdf5 file")

region = f['Exports']['p13uhs0_1247']
# ['Buses', 'Circuits', 'Frequency', 'FrequencyColumns', 'Lines', 'Loads', 'Mode', 'ModeColumns', 'PVSystems', 'Storages', 'Timestamp', 'TimestampColumns', 'Transformers']
values = region['Buses']['ElementProperties']['puVmagAngleNames'][()]
print("Values: ", values)
print("Converting to CSV...")
values
print("hello")