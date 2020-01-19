# redis 사용법

```javascript

connectPg.on('error', () => console.log('Lost PG connection'));
connectPg
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));
const redisPublisher = connectRedis.duplicate();

...

this.app.get('/', (req, res) => {
  res.send('hi!');
});
this.app.get('/values/all', async (req, res) => {
  const values = await connectPg.query('SELECT * from values');
  res.send(values.rows);
});
this.app.get('/values/current', async (req, res) => {
  redisPublisher.hgetall('values', (err, values) => {
    res.send(values);
  });
});
this.app.post('/values', async (req, res) => {
  try {
    const index = req.body.index;
    if (parseInt(index) > 40) {
      return res.status(422).send('Index too high');
    }
    redisPublisher.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index, err => console.err);
    connectPg.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.send({ working: true });
  } catch (error) {
    console.error(error);
  }
});
```

# redis basic example

```javascript
app.get('/jsonholder', (req, res) => {
  const redisKey = 'test5';

  return redisPublisher.get(redisKey, (err, response) => {
    if (err) {
      console.error(err);
    }
    if (response) {
      redisPublisher.publish(redisKey, response);
      return res.json({ type: 'cached', data: JSON.parse(response) });
    } else {
      fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => response.json())
        .then(response => {
          redisPublisher.setex(redisKey, 3, JSON.stringify(response));
          return res.json({ type: 'onfly', data: response });
        });
    }
  });
});
```
