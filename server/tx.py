import pandas as pd

print("Starting...")

# read in csv, timestamps as indices
df = pd.read_csv(
    filepath_or_buffer="~/Documents/code/js/d3/dssVis/data/csv/voltage3.csv"
    # index_col="time"
    )

# remove buses with 0 voltages
df.loc[:, (df != 0).any(axis=0)]

# make a small version for prototyping
df_mini = df.head(10)

# melt into 3 columns
df_unpivot = pd.melt(df, id_vars="time")

df_mini_unpivot = pd.melt(df_mini, id_vars="time")
print(df_mini_unpivot)

# export
# df_unpivot.to_csv(
#     path_or_buf="~/Documents/code/js/d3/dssVis/data/csv/voltage3melt.csv",
#     index=False
#     )

# df_mini_unpivot.to_csv(
#     path_or_buf="~/Documents/code/js/d3/dssVis/data/csv/voltageMiniMelt.csv",
#     index=False
#     )

df_mini.to_csv(
    path_or_buf="~/Documents/code/js/d3/dssVis/data/csv/voltageMini.csv",
    index=False
    )

print("done!")
