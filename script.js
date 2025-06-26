//? 'https://pokeapi.co/api/v2/pokemon/25' 에서 얻을 수 있는 내용: 영어이름, 스킬, 스탯, 유형 등..
//? 'https://pokeapi.co/api/v2/pokemon-species/25'에서는? 한글이름, 한글설명, 


const image = document.getElementById("image")
const re = document.getElementById("re")
const evo = document.getElementById("evo")
const names = document.getElementById("name")
const information = document.getElementById("information")
const types = document.getElementById("types")
const moves = document.getElementById("moves")
const stats = document.getElementById("stats")
const evoLight = document.getElementById("evoLight")
const poketball = document.getElementById("poketball")

const statName = {
    hp: "체력",
    attack: "공격력",
    defense: "방어력",
    "special-attack": "특수공격력",
    "special-defense": "특수방어력",
    speed: "스피드"
}

let evoNames = [];  // 진화 이름 전체 저장용 배열
let evoIndex = 0;   // 현재 보여주는 진화 인덱스
let currentPokemonName = '';    //현재 보여주는 포겟몬 이름



function getAllEvosSimple(chain) {
    let evos = [];  //진화이름 담을 배열

    while (chain) {   //참인 동안 계속 반복
        evos.push(chain.species.name);  //종이름을 배열에 집어넣음

        if (chain.evolves_to.length > 0) {  // 만약 다음 진화 단계가 있으면
            chain = chain.evolves_to[0];   //다음 진화 단계 중 첫 번째 것으로 chain을 바꿔줌.
        } else {
            chain = null;  // 더 이상 진화가 없으면 거짓으로 종료.
        }
    }

    return evos;
}




//! -1) 들어가면 랜덤하게 숫자를 선택 (1~1000)
function random () { 
    const random = Math.ceil(Math.random()*1000);
    console.log(random);



    //!   포켓몬 울음소리
    function playCry (cry) {
        const audio = new Audio(cry);
        audio.volume = 0.2;
        audio.play();
    }

    //! -2) 포켓몬 api를 요청해서 포켓몬 이미지를 보여주고 렌더링
    fetch(`https://pokeapi.co/api/v2/pokemon/${random}`)
        .then(data => data.json())
        .then(data => {
            currentPokemonName = data.name; // 현재 포켓몬의 이름을 저장함
            //이미지
            image.innerHTML = `<img src="${data.sprites.front_default}">`;

            //유형
            types.innerHTML = `${data.types.map(t=>t.type.name).join(`, `)}`;    //types를 돌면서 각각의 type명만 꺼냄

            //기술
            moves.innerHTML = data.moves[0].move.name;  //moves의 첫 번째 move명을 가져옴

            //능력치
            stats.innerHTML = data.stats.map(stat => `${statName[stat.stat.name]}: ${stat.base_stat}`).join(`<br>`);
                                                        //hp->체력 변경한 내용
            //이미지 클릭시 울음소리
            const cry = data.cries?.latest; //울음소리 있으면 가져오고 없으면 X
            if (cry) {
                image.onclick = function() {
                    playCry(cry);
                };
            }
            return fetch(`https://pokeapi.co/api/v2/pokemon-species/${random}`);
        })
        .then(data => data.json())
        .then(data => {

            //한국어이름 찾기
            const koreanName = data.names.find(data => data.language.name === 'ko').name;   //-species의 데이터 중 언어가 ko로 된 게 있으면 그거의 name을 데려와라
            names.innerHTML = `${koreanName}`;

            //한국어설명 찾기
            const koreaInfo = data.flavor_text_entries.find(data => data.language.name === 'ko')?.flavor_text || '알 수 없다.'; //한글설명 없으면 알 수 없다고 하기
            information.innerHTML = koreaInfo;

            return fetch(data.evolution_chain.url); //species 데이터 중 진화 체인을 가져옴
        })
        .then(data => data.json())
        .then(evoData => {  //진화 관련 내용
            evoNames = getAllEvos(evoData.chain);   // 진화하는 애들 이름 가져오는 함수에 데이터의 체인 부분을 넣음
                                                    //함수가 돌면서 체인에서 진화 포켓몬 이름을 뽑아옴. ex: ["pichu", "pikachu", "raichu"];
            evoIndex = evoNames.findIndex(name => name.toLowerCase() === currentPokemonName.toLowerCase());
                //진화 이름들 배열에서 -> 영어로 된 이름들 소문자로 바꿔서 하나하나 돌면서 -> 현재 포켓몬이랑 똑같은 걸 찾아서 번호 매김. 

            if (evoNames.length > 1 && evoIndex < evoNames.length - 1) {  //진화이름 배열의 길이가 1 초과 = 진화를 한 번이라도 하는 애들이고, 현재 포켓몬이 마지막 단계가 아니면 버튼 보이게 함
                evo.style.display = "block"; // 버튼 보이게
            } else {
                evo.style.display = "none"; // 아니면 버튼 숨김
            }
        })
        .catch(err => {
            console.log("오류 발생", err);  //"오류 발생 , 애러 객체" 콘솔에 출력
            image.innerHTML = `<p>어라.. <br>포켓몬 친구가 지금은 <br>혼자 있고 싶대요.</p>`;
        });
        
}

//! 진화 버튼 클릭 시 실행되는 함수
evo.onclick = () => {
    // 다음 진화가 있으면 evoIndex 증가시키고 해당 포켓몬 정보 로드
    if (evoIndex < evoNames.length - 1) {   //아직 다음 진화가 남아있을 때.
        evoIndex++;     
        evoLight.style.display = "flex";
        setTimeout( () => {
            evoLight.style.display = "none";
        }, 800)
        
        const realname = evoNames[evoIndex].toLowerCase(); //진화이름 배열에서 진화 몇 번째인지에 따라 이름을 가져옴.
        fetch(`https://pokeapi.co/api/v2/pokemon/${realname}`)  //url에서 숫자 아이디 대신 이름으로 찾을 수도 있음. but, 대문자 섞이면 못찾으니 소문자화 하기
            .then(data => data.json())
            .then(data => {
                image.innerHTML = `<img src="${data.sprites.front_default}">`;  //0~1000번 중에 진화 다 된 애, 진화 아예 안한 애 다 있으니까 따로 깊숙히 안들어가도 걍 여기서 다 데려올 수 있음
                types.innerHTML = data.types.map(t => t.type.name).join(`, `);
                moves.innerHTML = data.moves[0].move.name;
                stats.innerHTML = data.stats.map(stat => `${statName[stat.stat.name]}: ${stat.base_stat}`).join(`<br>`);
                                                            //hp -> 체력 변환한 내용
                return fetch(`https://pokeapi.co/api/v2/pokemon-species/${realname}`); //species 들어가서 더 깊숙히 숨어있는 내용들 가져옴
            })
            .then(data => data.json())
            .then(speciesData => {
                const koreanName = speciesData.names.find(d => d.language.name === 'ko').name; 
                names.innerHTML = koreanName;

                const koreaInfo = speciesData.flavor_text_entries.find(d => d.language.name === 'ko')?.flavor_text || '알 수 없다.';
                information.innerHTML = koreaInfo;
                // 진화가 마지막이면 버튼 숨김
                if (evoIndex >= evoNames.length - 1) { //if로 쭉 index 늘리다가 만약 마지막에 도달했다면 숨기기
                    evo.style.display = "none";
                }
            })
    } else {
        // 더 진화할 거 없으면 버튼 숨기기 (이미 최종진화인데도 버튼이 안 사라지는 경우가 가끔 있어 추가함)
        evo.style.display = "none";
    }
}


random();   //처음에 버튼을 누르지 않아도 함수 실행
re.addEventListener("click", random);   //다시 뽑기 버튼 눌렀을 때 함수 다시 실행