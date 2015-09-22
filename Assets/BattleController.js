﻿#pragma strict
var wizardGameObject: GameObject;
var thunderNovaGameObject: GameObject;
private var epochStart = new System.DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);
private var groundPlane = Plane(Vector3(0.0, 1.0, 0.0), Vector3(0, 0, 0));
private var lastSkillTime: double;
private var nextSkillTime: double;
private var wizard: Wizard; // Wizard.js
private var wizardTargetPosition: Vector3;
private var thunderNova: ThunderNova; // ThunderNova.js

function Start () {
	lastSkillTime = (System.DateTime.UtcNow - epochStart).TotalSeconds;
	wizard = wizardGameObject.GetComponent(Wizard);
	wizardTargetPosition = wizardGameObject.transform.position;
	thunderNova = thunderNovaGameObject.GetComponent(ThunderNova);
	nextSkillTime = lastSkillTime + thunderNova.skillTime;
}

function Update () {
	var timestamp = (System.DateTime.UtcNow - epochStart).TotalSeconds;
	if(Input.GetMouseButtonUp(0)) {
		var ray: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var rayDistance: float;
		if(groundPlane.Raycast(ray, rayDistance)) {
			wizardTargetPosition = ray.GetPoint(rayDistance);
		}
	}
	if(null != wizardTargetPosition) {
		var targetDirection = wizardTargetPosition - wizardGameObject.transform.position;
		var velocity = targetDirection.normalized;
		wizardGameObject.GetComponent.<Rigidbody>().velocity = velocity;
	}
	var thunderNovaPosition = wizardGameObject.transform.position;
	thunderNovaPosition.y = 0;
	thunderNovaGameObject.transform.position = thunderNovaPosition;
	if(nextSkillTime < timestamp) {
		lastSkillTime = lastSkillTime + thunderNova.skillTime;
		nextSkillTime = lastSkillTime + thunderNova.skillTime;
	}
	thunderNova.UpdateUI(timestamp - lastSkillTime);
}