const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function distance(pointA, pointB) {
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
}

function runAnalysis() {
  const testSetSize = 100;
  const k = 10;
  
  _.range(3).forEach(feature => {
    const data = _.map(outputs, row => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();

      console.log('Feature:', feature, 'Accuracy:', accuracy);
  });
}

function knn(data, point, k) {
  return _.chain(data)
    .map(row => [
      distance(_.initial(row), point),
      _.last(row)
    ])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);

  _.range(featureCount).forEach(i => {
    const column = clonedData.map(row => row[i]);

    const min = _.min(column),
          max = _.max(column);
    
    clonedData.forEach((_, j) => {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    });
  });

  return clonedData;
}

