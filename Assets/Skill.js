#pragma strict
var uiNeedsUpdate = false;
var timeAfterCasting: double;
var skillTime: double;
var castingTime: double;
var alertTime: double;

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
