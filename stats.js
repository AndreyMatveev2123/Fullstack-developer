const PASSING_PERCENTAGE = 67;

function isArray(value) {
  return Array.isArray(value);
}

export function validateQuizData(data) {
  if (typeof data !== "object" || data === null || isArray(data)) {
    return false;
  }

  if (typeof data.quizTitle !== "string" || data.quizTitle.length === 0) {
    return false;
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false;
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false;
  }

  for (const attempt of data.attempts) {
    if (typeof attempt !== "object" || attempt === null || isArray(attempt)) {
      return false;
    }

    if (typeof attempt.name !== "string" || attempt.name.trim().length === 0) {
      return false;
    }

    if (
      !isArray(attempt.answers) ||
      attempt.answers.length !== data.correctAnswers.length
    ) {
      return false;
    }
  }

  return true;
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0;

  attempt.answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score += 1;
    }
  });

  const percentage = Math.round((score / correctAnswers.length) * 100);

  return {
    name: attempt.name.trim(),
    score: score,
    percentage: percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  };
}

export function calculateReport(data) {
  const attempts = data.attempts.map((attempt) =>
    calculateAttempt(attempt, data.correctAnswers),
  );

  let passedCount = 0;
  let percentageSum = 0;
  let best = attempts[0];

  attempts.forEach((attempt) => {
    if (attempt.passed) {
      passedCount += 1;
    }

    percentageSum += attempt.percentage;

    if (attempt.score > best.score) {
      best = attempt;
    }
  });

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(percentageSum / attempts.length),
    passedCount: passedCount,
    threshold: PASSING_PERCENTAGE,
    best: best,
    attempts: attempts,
  };
}
