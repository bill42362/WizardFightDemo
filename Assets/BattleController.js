#pragma strict
var wizardGameObject: GameObject;
var thunderNovaGameObject: GameObject;
private var epochStart = new System.DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);
private var groundPlane = Plane(Vector3(0.0, 1.0, 0.0), Vector3(0, 0, 0));
private var usingSkillGameObject: GameObject;
private var enemyGameObject: GameObject;
private var lastSkillTime: double;
private var nextSkillTime: double;
private var wizard: Wizard; // Wizard.js
private var wizardTargetPosition: Vector3;
private var usingSkill: Skill; // Skill.js

function Start () {
	lastSkillTime = (System.DateTime.UtcNow - epochStart).TotalSeconds;
	wizard = wizardGameObject.GetComponent(Wizard);
	wizardTargetPosition = wizardGameObject.transform.position;
	NewEnemey();
	SetUsingSkill(thunderNovaGameObject);
	nextSkillTime = lastSkillTime + usingSkill.skillTime;
}
function NewEnemey() {
	enemyGameObject = Instantiate(wizardGameObject, new Vector3(10, 0.5, 15), Quaternion.identity);
	enemyGameObject.name = 'enemy';
}
function SetUsingSkill(skillGameObject: GameObject) {
	usingSkillGameObject = skillGameObject;
	usingSkill = usingSkillGameObject.GetComponent(Skill);
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
		var force = targetDirection.normalized*5;
		wizardGameObject.GetComponent.<Rigidbody>().AddForce(force);
	}
	
	var usingSkillPosition = wizardGameObject.transform.position;
	usingSkillPosition.y = 0;
	usingSkillGameObject.transform.position = usingSkillPosition;
	if(nextSkillTime < timestamp) {
		lastSkillTime = lastSkillTime + usingSkill.skillTime;
		nextSkillTime = lastSkillTime + usingSkill.skillTime;
	}
	usingSkillGameObject.GetComponent(Skill).SetUiNeedsUpdate(timestamp - lastSkillTime);

	if(null == enemyGameObject) { NewEnemey(); }
	var enemyForce: Vector3 = Vector3(Random.Range(-10.0, 10.0), 0, Random.Range(-11.0, 9.0));
	enemyForce = enemyForce.normalized*5;
	enemyGameObject.GetComponent.<Rigidbody>().AddForce(enemyForce);
}
