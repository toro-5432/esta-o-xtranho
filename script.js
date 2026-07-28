// Busca o clima usando a API gratuita Open-Meteo
async function buscarClima() {
    const cidade = document.getElementById("cidade").value.trim();

    if (!cidade) {
        alert("Digite o nome de uma cidade.");
        return;
    }

    try {

        // Procura a cidade
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;

        const geoResposta = await fetch(geoURL);
        const geoDados = await geoResposta.json();

        if (!geoDados.results || geoDados.results.length === 0) {
            alert("Cidade não encontrada.");
            return;
        }

        const local = geoDados.results[0];

        const latitude = local.latitude;
        const longitude = local.longitude;

        // Busca os dados meteorológicos
        const climaURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

        const resposta = await fetch(climaURL);
        const dados = await resposta.json();

        document.getElementById("nomeCidade").innerHTML =
            `${local.name}, ${local.country}`;

        document.getElementById("temperatura").innerHTML =
            `${Math.round(dados.current.temperature_2m)} °C`;

        document.getElementById("umidade").innerHTML =
            `${dados.current.relative_humidity_2m}%`;

        document.getElementById("vento").innerHTML =
            `${dados.current.wind_speed_10m} km/h`;

        document.getElementById("descricao").innerHTML =
            traduzirTempo(dados.current.weather_code);

        document.getElementById("icone").src =
            obterIcone(dados.current.weather_code);

    } catch (erro) {

        console.error(erro);

        alert("Erro ao acessar os dados meteorológicos.");

    }
}


// Traduz os códigos da Open-Meteo
function traduzirTempo(codigo) {

    const clima = {

        0: "Céu limpo",
        1: "Predominantemente limpo",
        2: "Parcialmente nublado",
        3: "Nublado",

        45: "Nevoeiro",
        48: "Nevoeiro intenso",

        51: "Garoa fraca",
        53: "Garoa",
        55: "Garoa forte",

        61: "Chuva fraca",
        63: "Chuva",
        65: "Chuva forte",

        71: "Neve fraca",
        73: "Neve",
        75: "Neve forte",

        80: "Pancadas de chuva",
        81: "Pancadas moderadas",
        82: "Pancadas fortes",

        95: "Tempestade",
        96: "Tempestade com granizo",
        99: "Tempestade severa"

    };

    return clima[codigo] || "Condição desconhecida";
}


// Ícones da OpenWeather (somente imagens)
function obterIcone(codigo) {

    if (codigo === 0)
        return "https://openweathermap.org/img/wn/01d@2x.png";

    if ([1].includes(codigo))
        return "https://openweathermap.org/img/wn/02d@2x.png";

    if ([2].includes(codigo))
        return "https://openweathermap.org/img/wn/03d@2x.png";

    if ([3,45,48].includes(codigo))
        return "https://openweathermap.org/img/wn/04d@2x.png";

    if ([51,53,55,61,63,65,80,81,82].includes(codigo))
        return "https://openweathermap.org/img/wn/10d@2x.png";

    if ([71,73,75].includes(codigo))
        return "https://openweathermap.org/img/wn/13d@2x.png";

    if ([95,96,99].includes(codigo))
        return "https://openweathermap.org/img/wn/11d@2x.png";

    return "https://openweathermap.org/img/wn/50d@2x.png";
}


// Buscar com Enter
document.getElementById("cidade").addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        buscarClima();
    }

});


// Cidade inicial
window.onload = () => {

    document.getElementById("cidade").value = "Curitiba";
    buscarClima();

};