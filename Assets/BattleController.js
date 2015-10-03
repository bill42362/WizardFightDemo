#pragma strict
var wizardGameObject: GameObject;
var skillButtonGameObject: GameObject;
var thunderNovaCasterGameObject: GameObject;
var fireCannonCasterGameObject: GameObject;
var deathVortexCasterGameObject: GameObject;
var canvasGameObject: GameObject;
var uiTriggeredTimestamp: double = 0.0;
private var epochStart = new System.DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);
private var groundPlane = Plane(Vector3(0.0, 1.0, 0.0), Vector3(0, 0, 0));
private var skills = new Array();
private var skillTurnedOn = new Array();
private var skillButtons = new Array();
private var usingSkillGameObject: GameObject;
private var usingSkill: Skill; // Skill.js
private var usingSkillIndex: int = 0;
private var usingSkillButton: SkillButton; // SkillButton.js
private var lastSkillTime: double;
private var nextSkillTime: double;
private var enemyGameObject: GameObject;
private var enemySkillGameObject: GameObject;
private var enemySkill: Skill; // Skill.js
private var lastEnemySkillTime: double;
private var nextEnemySkillTime: double;
private var playerGameObject: GameObject;
private var player: Wizard; // Wizard.js
private var playerTargetPosition: Vector3;

function Start () {
	AddSkillCaster(thunderNovaCasterGameObject);
	AddSkillCaster(fireCannonCasterGameObject);
	AddSkillCaster(deathVortexCasterGameObject);
	SetEnemySkill(thunderNovaCasterGameObject);
	lastSkillTime = (System.DateTime.UtcNow - epochStart).TotalSeconds;
	lastEnemySkillTime = lastSkillTime;
	NewPlayer();
	NewEnemey();
	SetUsingSkillIndex(usingSkillIndex);
	nextSkillTime = lastSkillTime + usingSkill.skillTime;
	nextEnemySkillTime = lastEnemySkillTime + enemySkill.skillTime;
}
function NewPlayer() {
	playerGameObject = Instantiate(wizardGameObject, new Vector3(10, 0.5, 5), Quaternion.identity);
	playerGameObject.SetActive(true);
	playerGameObject.name = 'player';
	player = playerGameObject.GetComponent(Wizard);
	playerTargetPosition = playerGameObject.transform.position;
	if(null != enemyGameObject) {
		enemyGameObject.GetComponent(EnemyAI).player = playerGameObject;
	}
}
function NewEnemey() {
	enemyGameObject = Instantiate(wizardGameObject, new Vector3(10, 0.5, 15), Quaternion.identity);
	enemyGameObject.SetActive(true);
	enemyGameObject.name = 'enemy';
	var enemyAi = enemyGameObject.GetComponent(EnemyAI);
	enemyAi.isEnemy = true;
	if(null != playerGameObject) {
		enemyAi.player = playerGameObject;
	}
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
	s.GetComponent(Skill).wizardName = 'player';
	var skillButton = skillButtonGb.GetComponent(SkillButton);
	skillButton.SetCaster(s);
	skillButton.SetSkillSequence(skills.length - 1);
	skillButton.SetRenderColor(s.GetComponent(Skill).GetRenderColor());
	skillButton.battleController = this;
	skillButtons.Add(skillButton);
	skillTurnedOn.Add(true);
}
private function UnsetEnemySkill() {
	if(null != enemySkillGameObject) {
		Destroy(enemySkillGameObject);
	}
	if(null != enemySkill) { enemySkill = null; }
}
private function SetEnemySkill(skillGameObject: GameObject) {
	UnsetUsingSkill();
	enemySkillGameObject = Instantiate(skillGameObject);
	enemySkillGameObject.SetActive(true);
	enemySkill = enemySkillGameObject.GetComponent(Skill);
	enemySkill.wizardName = 'enemy';
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
function MoveSkillObjectToWizardObject(s: GameObject, w: GameObject) {
	if((null != s) && (null != w)) {
		var skillPosition = w.transform.position;
		skillPosition.y = 0;
		s.transform.position = skillPosition;
	}
}

function Update () {
	if(null == playerGameObject) { NewPlayer(); }
	if(null == enemyGameObject) { NewEnemey(); }

	var timestamp = (System.DateTime.UtcNow - epochStart).TotalSeconds;
	if(Input.GetMouseButtonUp(0)) {
		var diff: float = uiTriggeredTimestamp - timestamp*1000;
		var diffAbs: float = Mathf.Abs(diff);
		if(0.05 < diffAbs) {
			var ray: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
			var rayDistance: float;
			if(groundPlane.Raycast(ray, rayDistance)) {
				playerTargetPosition = ray.GetPoint(rayDistance);
			}
		}
	}
	if(null != playerTargetPosition) {
		var targetDirection = playerTargetPosition - playerGameObject.transform.position;
		var force = targetDirection.normalized*15;
		playerGameObject.GetComponent.<Rigidbody>().velocity = force;
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
	if(nextEnemySkillTime < timestamp) {
		lastEnemySkillTime = nextEnemySkillTime;
		nextEnemySkillTime += enemySkill.skillTime;
	}
	if(null != usingSkillGameObject) {
		MoveSkillObjectToWizardObject(usingSkillGameObject, playerGameObject);
		var skillObject = usingSkillGameObject.GetComponent(Skill);
		var timeAfterCasting = timestamp - lastSkillTime;
		usingSkillGameObject.GetComponent(Skill).SetUiNeedsUpdate(timeAfterCasting);
		usingSkillButton.SetRenderColor(skillObject.GetRenderColor());
		enemyGameObject.GetComponent(EnemyAI).shouldRunAway = skillObject.GetIsVisiable();
	}
	if(null != enemySkillGameObject) {
		MoveSkillObjectToWizardObject(enemySkillGameObject, enemyGameObject);
		var enemyTimeAfterCasting = timestamp - lastEnemySkillTime;
		enemySkillGameObject.GetComponent(Skill).SetUiNeedsUpdate(enemyTimeAfterCasting);
	}
}
