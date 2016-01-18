{
    init: function(elevators, floors) {
        
        var find_closest_and_idle_elevator = function(floorNum){
            var elevator
            var dis = -1
            elevators.forEach(function(e){
                if(e.loadFactor() == 0){
                    new_dis = Math.abs(e.currentFloor() - floorNum)
                    if(dis==-1 || new_dis < dis ){
                        dis = new_dis
                        elevator = e
                    }
                }
            })
            
            return elevator
        }
        
        floors.forEach(function(floor){
            floor.on("up_button_pressed", function() {
                floor_num = floor.floorNum()
                floor.waiting_up = true
                
                elevator = find_closest_and_idle_elevator(floor_num)
                if(elevator){
                    elevator.goToFloor(floor_num)
                }
            })
            
            floor.on("down_button_pressed", function() {
                floor_num = floor.floorNum()
                floor.waiting_down = true
                              
                elevator = find_closest_and_idle_elevator(floor_num)
                if(elevator){
                    elevator.goToFloor(floor_num)
                }
            })
        }) 
        
        elevators.forEach(function(elevator){
            elevator.on("idle", function() {
                elevator.goingDownIndicator(true)
                elevator.goingUpIndicator(true)
                
                for(var i=1; i<floors.length; i++){
                    var upper = elevator.currentFloor() + i
                    if(upper < floors.length && floors[upper]){
                        if(floors[upper].waiting_up || floors[upper].waiting_down){
                            elevator.goToFloor(upper)
                            break
                        }
                    } 
                    
                    var lower = elevator.currentFloor() - i
                    if(lower >= 0 && floors[lower]){
                        if(floors[lower].waiting_up || floors[lower].waiting_down){
                            elevator.goToFloor(lower)
                            break
                        }
                    }
                }
            })
            
            elevator.on("floor_button_pressed", function(floorNum) {
                if(floorNum == elevator.currentFloor() ){
                    return
                }
                
                if(elevator.goingDownIndicator() && elevator.goingUpIndicator() ){
                    elevator.goingDownIndicator(floorNum < elevator.currentFloor())
                    elevator.goingUpIndicator(floorNum > elevator.currentFloor())
                }
                
                if(elevator.destinationQueue.indexOf(floorNum) == -1){
                    elevator.goToFloor(floorNum)
                }
            })
            
            elevator.on("passing_floor", function(floorNum, direction) {
                //alert(elevator.getPressedFloors())
                //alert(elevator.destinationQueue)
                ind = elevator.getPressedFloors().indexOf(floorNum)
                if(ind > -1){
                    for(var i = elevator.destinationQueue.length; i--;) {
                        if(elevator.destinationQueue[i] === floorNum) {
                            elevator.destinationQueue.splice(i, 1);
                        }
                    }
                    elevator.checkDestinationQueue();
                    elevator.goToFloor(floorNum, true)
                }else if(elevator.loadFactor() < 1){
                    if(direction === "up" && floors[floorNum].waiting_up){
                        elevator.goToFloor(floorNum, true)
                    }
                    if(direction === "down" && floors[floorNum].waiting_down){
                        elevator.goToFloor(floorNum, true)
                    }
                }
            })
            
            elevator.on("stopped_at_floor", function(floorNum) {
                for(var i = elevator.destinationQueue.length; i--;) {
                    if(elevator.destinationQueue[i] === floorNum) {
                        elevator.destinationQueue.splice(i, 1);
                    }
                }
                elevator.checkDestinationQueue()
                
                if(elevator.getPressedFloors().length == 0){
                    elevator.goingDownIndicator(true)
                    elevator.goingUpIndicator(true)
                }
                
                if(elevator.currentFloor() == floors.length-1){
                    elevator.goingDownIndicator(true)
                    elevator.goingUpIndicator(false)
                }

                if(elevator.currentFloor() == 0){
                    elevator.goingDownIndicator(false)
                    elevator.goingUpIndicator(true)
                }
                
                //alert(elevator.destinationDirection())
                if(elevator.goingUpIndicator()){
                    floors[floorNum].waiting_up = false
                }
                
                if(elevator.goingDownIndicator()){
                    floors[floorNum].waiting_down = false
                }

            })
            
        })
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
