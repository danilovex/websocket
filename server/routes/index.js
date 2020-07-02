module.exports = function(app){

    app.route('/').get(function(req, res) {
        res.render('./index', { title: 'Hello World' });
    });

    app.route('/api/cars').get(function(req, res) {
      let cars = [{
        company: 'General Motors',
        car: 'Celta'
      }];
      res.json(cars);
    });

    app.route('/api/foods').get(function(req, res) {
      let foods = ['Apple', 'Banana', 'Rice'];
      res.json(foods);
    });
};