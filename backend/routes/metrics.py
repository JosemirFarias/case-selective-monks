
from fastapi import APIRouter, Depends, HTTPException, Query
from auth import get_current_user
from data_loader import load_metrics

router = APIRouter()
METRICS_PATH = "../data/metrics.csv"


@router.get("/metrics")
def get_metrics(
    current_user: dict = Depends(get_current_user),
    start_date: str = Query(
        None, description="Data de início no formato YYYY-MM-DD"),
    end_date: str = Query(
        None, description="Data de fim no formato YYYY-MM-DD"),
):

    try:
        df = load_metrics(METRICS_PATH, parse_dates=["date"])
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao ler os dados: {str(e)}")

    if start_date:
        if start_date:
            df = df[df["date"] >= start_date]
        if end_date:
            df = df[df["date"] <= end_date]

    if current_user.get("role") != "admin" and "cost_micro" in df.columns:
        df = df.drop(columns=["cost_micro"])

    return df.to_dict(orient="records")
