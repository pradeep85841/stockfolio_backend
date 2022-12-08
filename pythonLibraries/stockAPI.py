from nsepython import *
from nsepy.urls import *
from nsepy import *
from datetime import date
from fastapi import FastAPI
import yfinance as yf

app = FastAPI()




@app.get("/financeratio")
def livedata(symbol):
    if symbol is None:
        text = "incomplete information provided"
        return text
    else:
        data = yf.Ticker(symbol+'.NS')
        dict =  data.info
        return dict

@app.get("/livedata")
def livedata(symbol):
    if symbol is None:
        text = "incomplete information provided"
        return text
    else:
        data = nse_eq(symbol)['priceInfo']['lastPrice']
        f=f'{data}'
        return f

@app.get("/pastdata")
def pastdata(symbol, start:date, end:date):
    if symbol is None:
        text = "incomplete information provided"
        return text
    else:
        data = get_history(symbol=symbol, start=start, end=end)
        df = pd.DataFrame({"Symbol":data.Symbol,"Series":data.Series[0],"Open":data.Open[0],"High":data.High[0],"Low":data.Low[0],"Close":data.Close[0],"VWAP":data.VWAP[0],"Volume":data.Volume[0],"Turnover":data.Turnover[0],"Trades":data.Trades[0]}, index=[0])
        return(df.to_json())
       
@app.get("/stockdetails")
def data(symbol = None):
    if symbol is None:
        text = "missing symbol"
        return text

    else:
       return nse_eq(symbol)


@app.get("/historydata")
def data(symbol):
    if symbol is None:
        text = "incomplete information provided"
        return text
    else:
      symbol = symbol
      series = "EQ"
      start_date = "01-01-2012"
      end_date ="02-01-2012"
      h = equity_history(symbol,series,start_date,end_date)
      f=f'{h.VWAP}'
      result = f[5]+f[6]+f[7]+f[8]+f[9]+f[10]
      return f

