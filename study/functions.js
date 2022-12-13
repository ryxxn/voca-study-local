	    
//----------------셔플 함수--------------------------

function shuffle(array){
let currentIndex = array.length, randomIndex;

//While there remain elements to shuffle...
while(currentIndex != 0){
    //Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    //And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
return array;
}

//---------------------------------------------------   
//-------"단어보기" 지우고 맞고 틀린 개수 위치 맞춰주는 함수-------
function infoHide(h, s){
    document.getElementById(h).style.display = "none";
    document.getElementById(s).style.display = "block";
}
//----------------------------------------------------------------

//----------------------------------------------------
function showChange(h, s){
    if(document.getElementById(h).style.display === "block"){
        infoHide(h, s);
    }
    else{
        infoShow(h, s);
    }
}

//----------------------------------------------------	   

//-------------------버튼 셔플 함수--------------------
function btnShuffle(n){
    let arr = [];
    let tmpArr = [];

    //btnArr에 n번째 단어 넣기
    arr.push(selectDB[n]);

    tmpArr = selectDB.slice(0, n).concat(selectDB.slice(n+1,));
    tmpArr = shuffle(tmpArr);

    arr.push(tmpArr[0]);
    arr.push(tmpArr[1]);
    arr.push(tmpArr[2]);

    arr = shuffle(arr);

    return arr;

}
//------------------------------------------------------------------

//-------"단어보기" 보여주고 맞고 틀린 개수 위치 맞춰주는 함수------
function infoShow(h, s){
    document.getElementById(h).style.display = "block";
    document.getElementById(s).style.display = "none";

    let n = cntNum;

    //LocalStorage에 hint++
    if (hintArr.indexOf(n) == -1){
        hintArr.push(n);

        hintCnt++

        //오답 Arr에 추가
        reviewCheck(selectDB[n]);

        document.querySelector('.vocaHint').innerText = hintCnt;
    }
}

//-------------------오답 데이터 추가 함수(2개 이상 x)---------------
function reviewCheck(data){
    // 중복 단어가 1개 이하이면 추가
    if(JSON.stringify(preReviewDB).split(data.voca).length < 3){
        reviewArr.push({'voca':data.voca, 'mean':data.mean});
    }   
}
//----------------------------------------------------

//-----------------------랭킹 함수------------------------
function rank(){
    //정답 : +5점, 오답 : -3점, 힌트 : -1점
    let score = parseInt((correctCnt*5 - wrongCnt*3 - hintCnt)/(selectDB.length*5)*100);


    if(score === selectDB.length*5){
        //php로 vocaDB 불러와서 클리어하면 true로 수정
        let storage = getData('voca');
        storage[userId][dayNum-1][LVNum-1].correctCnt = correctCnt;
        storage[userId][dayNum-1][LVNum-1].clear = true;
        console.log('good');
        setData('voca', storage);
    }
    else{
        //php로 vocaDB 불러와서 정답, 오답 정보 수정
        let oldStorage = getData('voca');

        if(score > oldStorage[userId][dayNum-1][LVNum-1].score){
            oldStorage[userId][dayNum-1][LVNum-1].score = score;
            oldStorage[userId][dayNum-1][LVNum-1].correctCnt = correctCnt;
            setData('voca', oldStorage);
            }
            console.log('not good');
        }

    return score;
    }       	

//------------------------------------------------------------------

//-----------------------결과창 화면 함수------------------------

function resultPage(){       
    let LVNumArr = ['Level 1', 'Level 2', 'Level 3', 'Test'];
    let score = rank();

    //php로 reviewDB에  오답Arr추가
    let rvwStorage = getData('reviewDB');
    for(let i=0; i < reviewArr.length; i++){
        rvwStorage[userId][dayNum-1].push(reviewArr[i]);
    }

    setData('reviewDB', rvwStorage);

    //-------------------------------------------------------------------

    if(hintCnt != 0){
        document.querySelector('#hintUseText').innerText = "다음번엔 힌트를 사용하지 말고 학습해보세요.";
    }
    else{
        document.querySelector('#hintUseText').innerText = "";
    }

    if(correctCnt == selectDB.length){
        document.querySelector('#outputText').innerText = "Day " + dayNum.toString() + ' ' + LVNumArr[LVNum-1] + "는 완벽합니다.\n" + LVNumArr[LVNum] + "에 도전해보세요.";
        if(hintCnt === 0){
            //php로 클리어한 정보 넣기
            let storage = getData('voca');
            storage[userId][dayNum-1][LVNum-1].clear = true;
            setData('voca', storage);
        }
    }
    else if((correctCnt >= selectDB.length - 5) & (correctCnt < selectDB.length)){
        document.querySelector('#outputText').innerText = "아쉽습니다. 완벽에 가깝습니다.";
    }
    else if((correctCnt >= selectDB.length - 10) & (correctCnt < selectDB.length)){
        document.querySelector('#outputText').innerText = "아쉽습니다. 조금 더 학습이 필요할 것 같습니다.";
    }
    else if((correctCnt >= selectDB.length - 20) & (correctCnt < selectDB.length - 10)){
        document.querySelector('#outputText').innerText = " 아직은 더 학습이 필요합니다.";
    }
    else{
        document.querySelector('#outputText').innerText = "상당히 부족합니다. 더 학습하세요.";
    }

    document.querySelector('.score').innerText = score;
    document.querySelector('#resultCorrectCnt').innerText = correctCnt;
    document.querySelector('#resultWrongCnt').innerText = wrongCnt;
    document.querySelector('#resultHintCnt').innerText = hintCnt;

    location.href = '#resultPage';	

}
//------------------------------------------------------------------
//-------------------버튼 클릭 이벤트 함수---------------------------

function clickVocaBtn(index){

    let n = cntNum;

    if (arr[index] === selectDB[n]){   
        for(let i = 0; i < 4; i++){
            document.querySelectorAll(".vocaButton")[i].style.backgroundColor = "";
            document.querySelectorAll(".vocaButton")[i].style.color = "";
        }

        cntNum = n+1;
        correctCnt++;

        document.querySelector('.vocaCorrect').innerText = correctCnt;

        if(n < selectDB.length-1){
            change();
        }
        else{
            resultPage();
        }
    }
    else{
        let btnId = ["#firstBtn", "#secondBtn", "#thirdBtn", "#fourthBtn"];

        document.querySelectorAll(".vocaButton")[index].style.backgroundColor = "#f75d5d";
        document.querySelectorAll(".vocaButton")[index].style.color = "white";
        document.querySelector(btnId[index]).innerText = arr[index].voca;

        if(wrongArr.indexOf(n) == -1){
            wrongArr.push(n);
            wrongCnt++;
            correctCnt--;

            //오답 Arr에 추가
            reviewCheck(selectDB[n]);

            document.querySelector('.vocaWrong').innerText = wrongCnt;
        }
    }
}
//------------------------------------------------------------------