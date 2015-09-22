#pragma strict
var skillTime: double;
var castingTime: double = 2.0;
var alertTime: double = 0.8;
var effectTime: double = 0.2;
private var rendererObject: Renderer;

function Start () {
	skillTime = castingTime + alertTime + effectTime;
	rendererObject = this.GetComponent.<Renderer>();
}

function Update() { }
function UpdateUI(time: double) {
	if(castingTime > time) {
		rendererObject.material.color = Color(0.2, 0.6, 0.8, 0.5);
	} else if(castingTime + alertTime > time) {
		rendererObject.material.color = Color(0.8, 0.2, 0.6, 0.5);
	} else {
		rendererObject.material.color = Color(0.8, 0.6, 0.2, 0.5);
	}
}
