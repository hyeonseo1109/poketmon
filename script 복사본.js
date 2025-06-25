//? 콘솔창에 fetch('https://pokeapi.co/api/v2/pokemon/25').then(r => r.json()).then(console.log)
//? 쳐서 내용 확인하기


const image = document.getElementById("image")
const re = document.getElementById("re")
const evo = document.getElementById("evo")
const names = document.getElementById("name")
const information = document.getElementById("information")
const types = document.getElementById("types")
const moves = document.getElementById("moves")
const stats = document.getElementById("stats")

const statName = {
    hp: "체력",
    attack: "공격력",
    defense: "방어력",
    "special-attack": "특수공격력",
    "special-defense": "특수방어력",
    speed: "스피드"
}


//! -1) 들어가면 랜덤하게 숫자를 선택 (1~1000)
function random () { 
    const random = Math.ceil(Math.random()*1000);


//!   포켓몬 울음소리
function playCry (cry) {
    const audio = new Audio(cry);
    audio.volume = 0.5;
    audio.play();
}

//! -2) 포켓몬 api를 요청해서 포켓몬 이미지를 보여주고 렌더링
    fetch(`https://pokeapi.co/api/v2/pokemon/${random}`)
        .then(data => data.json())
        .then(data => {
            //이미지
            image.innerHTML = `<img src="${data.sprites.front_default}">`

            //유형
            types.innerHTML = `⟪유형⟫ <br>${data.types.map(t=>t.type.name).join(`, `)}`

            //기술
            moves.innerHTML = `⟪대표기술⟫ <br>${data.moves[0].move.name}`

            //능력치
            stats.innerHTML = `⟪능력치⟫ <br>`+data.stats.map(stat => `${statName[stat.stat.name]}: ${stat.base_stat}`).join(`,<br>`);

            //이미지 클릭시 울음소리
            const cry = data.cries?.latest;
            if (cry) {
                image.onclick = function() {
                    playCry(cry);
                };
            }
            return fetch(`https://pokeapi.co/api/v2/pokemon-species/${random}`)
        })
        .then(data => data.json())
        .then(data => {
            //한국어이름 찾기
            const koreanName = data.names.find(data => data.language.name === 'ko').name;
            names.innerHTML = '';
            names.innerHTML += `${koreanName}`

            //한국어설명 찾기
            const koreaInfo = data.flavor_text_entries.find(data => data.language.name === 'ko').flavor_text;
            information.innerHTML = '';
            information.innerHTML += `⟪설명⟫ <br>${koreaInfo}`

            //진화하기
            const evoImage = data.evolution_chain;
            //진화버튼을 누르면 진화되고 여러번 진화하는 애들은 계속 진화됐으면 좋겠어

        })
        .catch(err => {
            console.log("오류 발생", err);
            image.innerHTML = `<p>어라.. <br>포켓몬 친구가 지금은 <br>혼자 있고 싶대요.</p>`;
        });
        
}
random();
re.addEventListener("click", random);
