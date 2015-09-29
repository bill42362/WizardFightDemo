#pragma strict
var isEnemy = false;
var player: GameObject;
var shouldRunAway: boolean = false;
private var playerPosition: Vector3;

function Start () {}
function Update () {
	if(true == isEnemy) {
		UpdatePlayerPosition();
		if(true == shouldRunAway) {
			RunAwayFromPlayer();
		} else {
			ApproachPlayer();
		}
	}
}
function UpdatePlayerPosition() {
	if(null != player) {
		playerPosition = player.gameObject.transform.position;
	}
}
function RunAwayFromPlayer() {
	if(null != playerPosition) {
		var selfPosition = gameObject.transform.position;
		var force: Vector3 = selfPosition - playerPosition;
		force = force.normalized*10;
		gameObject.GetComponent.<Rigidbody>().AddForce(force);
	}
}
function ApproachPlayer() {
	if(null != playerPosition) {
		var selfPosition = gameObject.transform.position;
		var force: Vector3 = selfPosition - playerPosition;
		force = -force.normalized*10;
		gameObject.GetComponent.<Rigidbody>().AddForce(force);
	}
}
