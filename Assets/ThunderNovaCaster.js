﻿#pragma strict
var skillTime: double;
var castingTime: double = 2.0;
var alertTime: double = 1.0;
var effectTime: double = 0.2;
var damage: double = 3.0;
private var skillObject: Skill; // Skill.js
private var rendererObject: Renderer;
private var effecting = false;

function Start () {
	skillTime = castingTime + alertTime + effectTime;
	skillObject = this.GetComponent.<Skill>();
	skillObject.skillTime = skillTime;
	skillObject.castingTime = castingTime;
	skillObject.alertTime = alertTime;
	rendererObject = this.GetComponent.<Renderer>();
}
function Update() {
	if(true == skillObject.uiNeedsUpdate) {
		UpdateUI(skillObject.timeAfterCasting);
	}
}
function UpdateUI(time: double) {
	effecting = false;
	if(castingTime > time) {
		rendererObject.material.color = Color(0.2, 0.6, 0.8, 0.5);
	} else if(castingTime + alertTime > time) {
		rendererObject.material.color = Color(0.8, 0.2, 0.6, 0.5);
	} else {
		rendererObject.material.color = Color(0.8, 0.6, 0.2, 0.5);
		effecting = true;
	}
	skillObject.uiNeedsUpdate = false;
}
function OnTriggerStay(other: Collider) {
	if((true == effecting) && ('enemy' == other.name)) {
		var enemy: Wizard = other.gameObject.GetComponent(Wizard);
		enemy.Damage(damage);
	}
}