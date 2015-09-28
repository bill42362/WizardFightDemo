#pragma strict
var skillCaster: GameObject;
var skillName: String = '(Null)';
private var TOTAL_SKILL_NUM: int = 3;
private var MAX_WIDTH: int = 100;
private var skillSequence: int = 0;
private var needsLayout: boolean = true;

function Start () { }
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
