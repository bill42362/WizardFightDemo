#pragma strict
var hp: float = 10;

function Start () { }

function Update () { }
function AddForce(force: Vector3) {
	this.GetComponent.<Rigidbody>().AddForce(force);
}
function Damage(attack: float) {
	hp -= attack;
	if(0 > hp) { Destroy(gameObject); }
}
