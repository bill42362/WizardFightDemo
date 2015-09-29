#pragma strict
var uiNeedsUpdate = false;
var timeAfterCasting: double;
var skillTime: double;
var castingTime: double;
var alertTime: double;
var skillName: String;
private var renderColor: Color;
private var isVisiable = false;

function Start () { }

function Update () { }
function SetUiNeedsUpdate(timeAfterCasting: double) {
	uiNeedsUpdate = true;
	this.timeAfterCasting = timeAfterCasting;
}
function inactivate() {
	uiNeedsUpdate = true;
}
function activate() {
	uiNeedsUpdate = true;
}
function GetRenderColor(): Color { return renderColor; }
function SetRenderColor(c: Color) { renderColor = c; }
function GetIsVisiable(): boolean { return isVisiable; }
function SetIsVisiable(i: boolean) { isVisiable = i; }
