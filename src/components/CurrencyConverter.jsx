import React, { useState, useEffect } from "react";
import axios from "axios";
import '../App.css'

const CurrencyConverter = () => {

    // STATE

    const [currencies, setCurrencies] = useState([]);
    const [fromCurrency, setFromCurrency] = useState("");
    const [toCurrency, setToCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [exchangeRate, setExchangeRate] = useState("");
    const [convertedAmount, setConvertedAmount] = useState("");

    // EFFECT

    // 환율 데이터
    useEffect(() => {
        axios
            .get("https://api.exchangerate-api.com/v4/latest/USD")
            .then((response) => {
                setCurrencies(Object.keys(response.data.rates));
                setFromCurrency("KRW");
                setToCurrency(Object.keys(response.data.rates)[0]);
                setExchangeRate(response.data.rates[Object.keys(response.data.rates)[0]]);
            })
            .catch((error) => console.log(error));
    }, []);

    // 통화 목록 데이터
    useEffect(() => {
        if (fromCurrency && toCurrency) {
            axios
                .get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
                .then((response) => {
                    setExchangeRate(response.data.rates[toCurrency]);
                })
                .catch((error) => console.log(error));
        }
    }, [fromCurrency, toCurrency]);


    // EVENT

    const handleFromCurrencyChange = (e) => {
        setFromCurrency(e.target.value);
    };

    const handleToCurrencyChange = (e) => {
        setToCurrency(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const convertCurrency = () => {
        if (!amount) {
            alert("금액을 기입해주세요");
            return;
        }
        const convertedAmount = (amount * exchangeRate).toFixed(2);
        setConvertedAmount(convertedAmount);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        convertCurrency();
    };

    return (
        <div className="App">
            <h2>환율 계산기</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="input-row">
                    <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="금액을 기입하세요"
                    />
                    <select value={fromCurrency} onChange={handleFromCurrencyChange}>
                        {currencies.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-row">
                    <input
                        type="number"
                        value={convertedAmount}
                        placeholder="변환되는 통화"
                        readOnly
                    />
                    <select value={toCurrency} onChange={handleToCurrencyChange}>
                        {currencies.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">변환</button>
            </form>
        </div>
    );
};

export default CurrencyConverter;
