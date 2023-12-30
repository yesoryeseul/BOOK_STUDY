function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy": // 비극
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;

      case "comedy": // 희극
        thisAmount = 30000;
        if (perf.audience > 30) {
          thisAmount += 1000 + 500 * (perf.audience - 20);
        }
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

// switch 문을 함수 추출해보자
// 별도 함수로 빼냈을 때 유효범위를 벗어나는 변수, 즉 새 함수에서는 곧바로 사용할 수 없는 변수를 매개변수로 전달한다.

// 해당 부분에서는 perf(aPerformance), play, thisAmount(result)가 있다
function amountFor(aPerformance, play) {
  // 값이 바뀌지 않는 변수는 매개변수로 전달
  let result = 0; // 변수를 초기화 하는 코드, 명확한 이름으로 변경
  switch (play.type) {
    case "tragedy": // 비극
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;

    case "comedy": // 희극
      result = 30000;
      if (aPerformance.audience > 30) {
        result += 1000 + 500 * (aPerformance.audience - 20);
      }
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }

  return result; // 함수 안에서 값이 바뀌는 변수 반환
}

// 이제 statement() 에서 thisAmount 값을 채울 떄 방금 추출한 amountFor() 함수를 호출한다.

function statement2(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play); // 추출한 함수를 이용

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

// 로컬 유효범위의 변수를 줄여보자.
// 변수를 인라인하기
function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

// 이제 statement() 에서 thisAmount 값을 채울 떄 방금 추출한 amountFor() 함수를 호출한다.
function statement3(invoice) {
  let result = `청구 내역 (고객명 ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    }석)\n`;
  }

  result += `총액: ${usd(totalAmount)}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;

  return result;

  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  // 값 누적 로직 별도 for문 처리
  function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
      // 포인트를 적립한다.
      result += volumeCreditsFor(perf); // 추출 함수를 이용해 값 누적
    }
    return result;
  }

  // 화폐 단위 맞추기 함수
  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    // 포인트를 적립한다.
    result += Math.max(aPerformance.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);

    return result;
  }

  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;

      case "comedy":
        result = 30000;
        if (aPerformance.audience > 30) {
          result += 1000 + 500 * (aPerformance.audience - 20);
        }
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }

    return result;
  } // amountFor() 끝
} // statement3() 끝
