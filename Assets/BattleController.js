#pragma strict
var wizardGameObject: GameObject;
var skillButtonGameObject: GameObject;
var thunderNovaCasterGameObject: GameObject;
var fireCannonCasterGameObject: GameObject;
var deathVortexCasterGameObject: GameObject;
var canvasGameObject: GameObject;
private var epochStart = new System.DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);
private var groundPlane = Plane(Vector3(0.0, 1.0, 0.0), Vector3(0, 0, 0));
private var skills = new Array();
private var skillTurnedOn = new Array();
private var skillButtons = new Array();
private var usingSkillIndex: int = 0;
private var usingSkillGameObject: GameObject;
private var usingSkillButton: SkillButton; // SkillButton.js
private var enemyGameObject: GameObject;
private var lastSkillTime: double;
private var nextSkillTime: double;
private var wizard: Wizard; // Wizard.js
private var wizardTargetPosition: Vector3;
private var usingSkill: Skill; // Skill.js

function Start () {
	AddSkillCaster(thunderNovaCasterGameObject);
	AddSkillCaster(fireCannonCasterGameObject);
	AddSkillCaster(deathVortexCasterGameObject);
	lastSkillTime = (System.DateTime.UtcNow - epochStart).TotalSeconds;
	wizard = wizardGameObject.GetComponent(Wizard);
	wizardTargetPosition = wizardGameObject.transform.position;
	NewEnemey();
	SetUsingSkillIndex(usingSkillIndex);
	nextSkillTime = lastSkillTime + usingSkill.skillTime;
}
function NewEnemey() {
	enemyGameObject = Instantiate(wizardGameObject, new Vector3(10, 0.5, 15), Quaternion.identity);
	enemyGameObject.name = 'enemy';
}
function AddSkillCaster(s: GameObject) {
	if(null == canvasGameObject) {
		canvasGameObject = new GameObject("canvas", Canvas);
		canvasGameObject.GetComponent(RectTransform).sizeDelta = Vector2(Screen.width, Screen.height);
		canvasGameObject.GetComponent(RectTransform).pivot = Vector2(0, 0);
		var canvas = canvasGameObject.GetComponent(Canvas);
		canvas.renderMode = RenderMode.ScreenSpaceOverlay;
		canvas.pixelPerfect = true;
	}
	var skillButtonGb = Instantiate(skillButtonGameObject);
	skillButtonGb.transform.SetParent(canvasGameObject.transform, false);
	skillButtonGb.SetActive(true);
	s.SetActive(false);
	skills.Add(s);
	var skillButton = skillButtonGb.GetComponent(SkillButton);
	skillButton.SetCaster(s);
	skillButton.SetSkillSequence(skills.length - 1);
	skillButton.SetRenderColor(s.GetComponent(Skill).GetRenderColor());
	skillButton.battleController = this;
	skillButtons.Add(skillButton);
	skillTurnedOn.Add(true);
}
private function UnsetUsingSkill() {
	if(null != usingSkillGameObject) {
		usingSkillGameObject.SetActive(false);
		usingSkillGameObject = null;
	}
	if(null != usingSkill) { usingSkill = null; }
}
private function SetUsingSkill(skillGameObject: GameObject) {
	UnsetUsingSkill();
	skillGameObject.SetActive(true);
	usingSkillGameObject = skillGameObject;
	usingSkill = usingSkillGameObject.GetComponent(Skill);
}
function SetUsingSkillIndex(i: int) {
	SetUsingSkill(skills[i]);
	usingSkillButton = skillButtons[i];
}
function ReplySkillButtonClicked(i: int) {
	skillTurnedOn[i] = !skillTurnedOn[i];
	var skillButton: SkillButton = skillButtons[i];
	skillButton.SetTurnedOn(skillTurnedOn[i]);
}
private function GetNextSkillIndex(): int {
	var index = -1;
	var testedNum = 0;
	var pin = usingSkillIndex;
	while((-1 == index) && (skills.length > testedNum)) {
		++testedNum;
		++pin;
		if(skills.length == pin) { pin = 0; }
		if(true == skillTurnedOn[pin]) {
			index = pin;
		}
	}
	return index;
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
		wizardGameObject.GetComponent.<Rigidbody>().velocity = force;
	}
	
	if(nextSkillTime < timestamp) {
		var nextSkillIndex = GetNextSkillIndex();
		if(-1 != nextSkillIndex) {
			usingSkillIndex = nextSkillIndex;
			SetUsingSkillIndex(nextSkillIndex);
			lastSkillTime = nextSkillTime;
			nextSkillTime += usingSkill.skillTime;
		} else {
			UnsetUsingSkill();
			nextSkillTime = timestamp;
		}
	}
	if(null != usingSkillGameObject) {
		var usingSkillPosition = wizardGameObject.transform.position;
		usingSkillPosition.y = 0;
		usingSkillGameObject.transform.position = usingSkillPosition;
		var skillObject = usingSkillGameObject.GetComponent(Skill);
		var timeAfterCasting = timestamp - lastSkillTime;
		skillObject.SetUiNeedsUpdate(timeAfterCasting);
		usingSkillButton.SetRenderColor(skillObject.GetRenderColor());
	}

	if(null == enemyGameObject) { NewEnemey(); }
	var enemyForce: Vector3 = Vector3(Random.Range(-10.0, 10.0), 0, Random.Range(-11.0, 9.0));
	enemyForce = enemyForce.normalized*5;
	enemyGameObject.GetComponent.<Rigidbody>().AddForce(enemyForce);
}
