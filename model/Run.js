export class Run {
    constructor(distance, duration, date, route, caloriesBurned, steps) {
        this.distance = distance; // in kilometers or miles
        this.duration = duration; // in minutes or hours
        this.date = date; // typically a Date object or a string
        this.route = Array.isArray(route) ? route : []; // Ensuring route is an array
        this.caloriesBurned = caloriesBurned; // in calories
        this.steps = steps; // number of steps taken
    }
}
