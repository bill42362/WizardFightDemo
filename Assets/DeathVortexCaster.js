#pragma strict
var skillTime: double;
var castingTime: double = 1.0;
var alertTime: double = 3.0;
var effectTime: double = 5.0;
var pullForce: double = 5.0;
private var skillObject: Skill; // Skill.js
private var rendererObject: Renderer;
private var effecting = false;

function Start () {
	skillTime = castingTime + alertTime + effectTime;
	skillObject = this.GetComponent.<Skill>();
	skillObject.skillTime = skillTime;
	skillObject.castingTime = castingTime;
	skillObject.alertTime = alertTime;
	skillObject.skillName = 'Death Vortex';
	skillObject.SetRenderColor(Color(0.0, 0.0, 0.0, 0.5));
	rendererObject = this.GetComponent.<Renderer>();
}
function Update() {
	if(true == skillObject.uiNeedsUpdate) {
		UpdateUI(skillObject.timeAfterCasting);
	}
}
function UpdateUI(time: double) {
	effecting = false;
	var renderColor: Color = Color(0.0, 0.0, 0.0, 0.0);
	if(castingTime > time) {
		renderColor = Color(0.2, 0.6, 0.8, 0.5);
	} else if(castingTime + alertTime > time) {
		renderColor = Color(0.8, 0.2, 0.6, 0.5);
	} else {
		renderColor = Color(0.0, 0.0, 0.0, 0.5);
		effecting = true;
	}
	rendererObject.material.color = renderColor;
	skillObject.SetRenderColor(renderColor);
	skillObject.uiNeedsUpdate = false;
}
function OnTriggerStay(other: Collider) {
	if((true == effecting) && ('enemy' == other.name)) {
		var enemyGameObject: GameObject = other.gameObject;
		var selfPosition = transform.position;
		var enemyPosition = enemyGameObject.transform.position;
		var force = (selfPosition - enemyPosition)*pullForce;
		enemyGameObject.GetComponent.<Rigidbody>().AddForce(force);
	}
}
