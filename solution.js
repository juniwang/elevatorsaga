
{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator
        
        floors.forEach(function(floor){
            floor.on("up_button_pressed down_button_pressed", function() {
                elevator.goToFloor(floor.floorNum())
            })
        }) 
      
        elevator.on("floor_button_pressed", function(floorNum) {
            // Maybe tell the elevator to go to that floor?
            elevator.goToFloor(floorNum)
        })
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
