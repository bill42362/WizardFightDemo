#pragma strict
var skillCaster: GameObject;
var skillName: String = '(Null)';
var battleController: BattleController;
var turnedOffSkillButtonMaterial: Material;
private var epochStart = new System.DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);
private var TOTAL_SKILL_NUM: int = 3;
private var MAX_WIDTH: int = 100;
private var skillSequence: int = 0;
private var needsLayout: boolean = true;
private var buttonObject: UI.Button;

function Start () {
	buttonObject = GetComponent(UI.Button);
	buttonObject.onClick.AddListener(OnClick);
}
function Update () { }

function SetNeedsLayout() {
	needsLayout = true;
}
function SetSkillSequence(s: int) {
	skillSequence = s;
	SetNeedsLayout();
}
function SetCaster(c: GameObject) {
	skillCaster = c;
	skillName = c.GetComponent(Skill).skillName;
	SetNeedsLayout();
}
function SetTurnedOn(turnedOn: boolean) {
	if(true == turnedOn) {
		GetComponent(UI.Image).material = null;
	} else {
		GetComponent(UI.Image).material = turnedOffSkillButtonMaterial;
	}
}
function SetRenderColor(c: Color) {
	c.a = 0.75;
	GetComponent(UI.Image).color = c;
}
function OnGUI() {
	if(true == needsLayout) {
		var width = Mathf.Min(MAX_WIDTH, Screen.width/TOTAL_SKILL_NUM);
		var height = width;
		var posX = Screen.width - (TOTAL_SKILL_NUM - skillSequence)*width;
		var rectTransform = gameObject.GetComponent(RectTransform);
		rectTransform.sizeDelta = Vector2(width, height);
		rectTransform.anchoredPosition = Vector2(posX, 0);
		gameObject.GetComponentInChildren(UI.Text).text = skillName;
		needsLayout = false;
	}
}
function OnClick() {
	if(null != battleController) {
		battleController.uiTriggeredTimestamp = (System.DateTime.UtcNow - epochStart).TotalMilliseconds;
		battleController.ReplySkillButtonClicked(skillSequence);
	}
}
