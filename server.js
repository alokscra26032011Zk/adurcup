var app       =     require("express")();
var http      =     require('http').Server(app);
var io        =     require("socket.io")(http);
var mongoose =      require('mongoose');

app.get("/",function(req,res){
    res.sendFile(__dirname + '/public/index.html');
});


io.on('connection',function(socket){
    socket.on('order added',function(order){
      add_order(order,function(res){
        if(res){
            io.emit('refresh order',order);
        } else {
            io.emit('error');
        }
      });
    });
});

mongoose.connect('mongodb://localhost/adurcup');
var Schema = mongoose.Schema;
var OrderSchema=new Schema({
  created: Date,
  content: String,
})

var Order = mongoose.model('Order', OrderSchema);


var add_order = function (order) {
    app.post('/add',function(req,res){
      new Order({
        created:new Date(),
        content:order,
      }).save(function(err,doc){
        if(err) res.json(err);
        else res.send('Successfully inserted');
      })
    })

}

http.listen(3000,function(){
    console.log("Listening on 3000");
});
