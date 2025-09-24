import pandas as pd
from dateutil.parser import parse


def load_users(path="data/users.csv"):
    df = pd.read_csv(path)
    return df


def load_metrics(path="data/metrics.csv"):
    df = pd.read_csv(path)
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"])
    return df
